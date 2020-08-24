/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import Authorization from "./Authorization";
import SocketTransporter from "./SocketTransporter"
import keval from "../../Keval/keval"
import Unpacker from "../TypeLanguage/Unpacker"
import TL from "../TypeLanguage/TL"
import DataCenter from "./DataCenter"
import AppConfiguration from "../../Config/AppConfiguration"
import telegram_crypto from "../Cryptography/telegram_crypto"
import Random from "../Utils/Random"
import Uint8 from "../Utils/Uint8"
import MessagesProcessor from "./MessagesProcessor"
import TelegramApplication from "../TelegramApplication"
import {longToBytes} from "../Utils/Bin"
import ConnectionState from "./ConnectionState"
import MTProtoInternal from "../Internal"

const {concat, compare} = Uint8;

class Connection {
    constructor(dcId: number, withUpdates: boolean, application: TelegramApplication) {
        this.dcId = dcId;
        this.dcUrl = DataCenter.chooseServer(dcId);

        this.withUpdates = withUpdates;
        this.application = application;

        this.isInitialized = false;
        this.awaitingInvokes = [];
        this.pingingInvervalId = null;

        this.authorization = new Authorization(this);
        this.state = new ConnectionState(this);
        this.processor = new MessagesProcessor(this);

        this.transporter = new SocketTransporter(this);

        this.timezoneOffset = new Date().getTimezoneOffset() * 60; //seconds

        this.doPinging = false;
    }

    get isMain() {
        return this.application.mainConnection === this;
    }

    get isReady() {
        return this.transporter.isReady &&
            this.isSocketConnected &&
            this.authorization &&
            this.authorization.isAuthorized &&
            !this.authorization.isAuthorizing &&
            this.isInitialized;
    }

    async init(props: { doPinging: boolean; } = {}) {
        const {
            doPinging = false,
        } = props;

        this.doPinging = doPinging;

        if (this.isInitialized) {
            console.warn("already initialized");
            return this.authorization.authKey;
        }

        const authKey = await keval.auth.getItem(`authKey${this.dcId}`);
        const serverSalt = await keval.auth.getItem(`serverSalt${this.dcId}`);

        this.authorization.setAuthKey(authKey);
        this.authorization.serverSalt = serverSalt;

        if (
            !this.authorization.isAuthorized ||
            !this.authorization.authKey
        ) {
            await this.authorization.authorize();
        }

        await keval.auth.setItem(`authKey${this.dcId}`, this.authorization.authKey);
        await keval.auth.setItem(`serverSalt${this.dcId}`, this.authorization.serverSalt);

        this.isInitialized = true;

        if (
            this.application.mainConnection.dcId !== this.dcId &&
            !await keval.auth.getItem(`imported${this.dcId}`) &&
            await this.application.isSignedIn()
        ) {
            const ExportedAuthorization = await this.application.mainConnection.invokeMethod("auth.exportAuthorization", {
                dc_id: this.dcId
            });

            await this.invokeMethod("auth.importAuthorization", ExportedAuthorization);

            await keval.auth.setItem(`imported${this.dcId}`, true);
        }

        this.resolveAwaiting();

        if (doPinging) {
            this.startPinging();
        }

        return this.authorization.authKey;
    }

    ping(check = true) {
        if (check && !this.doPinging) {
            if (this.pingingInvervalId) {
                clearInterval(this.pingingInvervalId);
                this.pingingInvervalId = null;

                if (!this.withUpdates) {
                    this.ping(false);
                }
                return;
            }
        }

        const ping_serializer = TL.packer();

        if (!this.withUpdates) {
            ping_serializer.int(0xbf9459b7, "invokeWithoutUpdates");
        }

        const ping_id = new Uint8Array([Random.nextInteger(0xFFFFFFFF), Random.nextInteger(0xFFFFFFFF)]);

        ping_serializer.method("ping", {
            ping_id
        });

        this.sendMessage({
            message_id: this.state.generateMessageId(),
            seq_no: this.state.generateSeqNo(true),
            message_body: ping_serializer.toUint8Array(),
        });
    }

    startPinging() {
        if (this.pingingInvervalId) {
            console.warn("already pinging")
            return;
        }

        this.pingingInvervalId = setInterval(() => this.ping(), 5000);
    }

    stopPinging() {
        this.pingingInvervalId = clearInterval(this.pingingInvervalId);
    }

    invokeMethod(name: string, params ?: any, props: { useSecondTransporter: boolean; } = {}): Promise<any> {
        let {useSecondTransporter} = props;
        let originalUseSecondTransporter = useSecondTransporter;

        if (useSecondTransporter) {
            if (this.isMain) {
                if (!this.secondTranporter) {
                    this.secondTranporter = new SocketTransporter(this);
                }
            } else {
                useSecondTransporter = false;
            }
        }

        if (!this.isReady) {
            return new Promise((resolve, reject) => {
                this.awaitingInvokes.push({
                    name,
                    params,
                    resolve,
                    reject,
                    useSecondTransporter,
                })
            });
        }

        const method_serializer = TL.packer();

        method_serializer.int(0xda9b0d0d); // invokeWithLayer
        method_serializer.int(AppConfiguration.mtproto.api.layer);
        if (!this.withUpdates || originalUseSecondTransporter) {
            method_serializer.int(0xbf9459b7); // invokeWithoutUpdates
        }
        // if (!this.initConnection) {
        method_serializer.int(0xc1cd5ea9); // initConnection
        method_serializer.int(2); //flags
        method_serializer.int(AppConfiguration.mtproto.api.api_id); // api_id
        method_serializer.string("Browser"); // device_model
        method_serializer.string(navigator.platform || "Unknown Platform"); // system_version
        method_serializer.string(AppConfiguration.mtproto.api.app_version); // app_version
        method_serializer.string(navigator.language || "en"); // system_lang_code
        method_serializer.string("tdesktop"); // lang_pack
        method_serializer.string(navigator.language || "en"); // lang_code
        method_serializer.object({tz_offset: this.timezoneOffset}, "JSONValue");
        // this.initConnection = true;
        // }

        method_serializer.method(name, params);

        const message_id = this.state.generateMessageId();
        const seq_no = this.state.generateSeqNo();
        const message_body = method_serializer.toUint8Array();

        return new Promise((resolve, reject) => {
            this.processor.pendingInvokations.set(message_id, {
                name,
                params,
                resolve,
                reject,
                useSecondTransporter
            });
            this.sendMessage({
                message_id,
                seq_no,
                message_body,
                useSecondTransporter,
            })
        });
    }

    invokeMTProtoMethod(name: string, params ?: any): Promise<Unpacker> {
        return new Promise((resolve, reject) => {
            const method_serializer = TL.packer();
            method_serializer.method(name, params);

            const method_bytes = method_serializer.toUint8Array();

            const bytes_serializer = TL.packer();
            bytes_serializer.int(0);
            bytes_serializer.int(0);
            bytes_serializer.long(this.state.generateMessageId());
            bytes_serializer.int(method_bytes.length);
            bytes_serializer.rawBytes(method_bytes);

            const bytes = bytes_serializer.toUint8Array();

            this.mtprotoHandler = {resolve, reject};

            this.transporter.transport(bytes.buffer);
        });
    }

    sendMessage(message: { message_id: string; message_body: Uint8Array, seq_no: number; useSecondTransporter: boolean; }) {
        const {message_id, message_body, seq_no, useSecondTransporter} = message;

        const message_serializer = TL.packer({maxLength: message_body.length + 2048});

        message_serializer.integer(this.authorization.serverSalt, 64);
        message_serializer.integer(this.authorization.sessionId, 64);

        message_serializer.long(message_id);
        message_serializer.int(seq_no);
        message_serializer.int(message_body.length);
        message_serializer.rawBytes(message_body);

        const message_bytes = message_serializer.toUint8Array();
        const padding = Uint8.random(
            (16 - (message_serializer.offset % 16)) + 16 * (1 + Random.nextInteger(5))
        );

        const encryptedtext = telegram_crypto.encrypt_message(concat(message_bytes, padding), this.authorization.authKey);

        const bytes_serializer = TL.packer({maxLength: encryptedtext.bytes.byteLength + 256});
        bytes_serializer.integer(this.authorization.authKeyId, 64);
        bytes_serializer.integer(encryptedtext.msg_key, 128);
        bytes_serializer.rawBytes(encryptedtext.bytes);

        if (useSecondTransporter) {
            this.secondTranporter.transport(bytes_serializer.toUint8Array().buffer);
        } else {
            this.transporter.transport(bytes_serializer.toUint8Array().buffer);
        }
    }

    ackMessages(msg_ids: string[]) {
        const message_body_serializer = TL.packer();

        message_body_serializer.object({
            _: "msgs_ack",
            msg_ids: msg_ids
        }, "Object");

        this.sendMessage({
            message_id: this.state.generateMessageId(),
            seq_no: this.state.generateSeqNo(true),
            message_body: message_body_serializer.toUint8Array(),
        });
    }

    reinvoke(message_id: string): void {
        const invokation = this.processor.pendingInvokations.get(message_id);

        if (!invokation) {
            console.warn("BUG: no invokation found to reinvoke");
            return;
        }

        this.processor.pendingInvokations.delete(message_id);

        this.invokeMethod(invokation.name, invokation.params, {useSecondTransporter: invokation.useSecondTransporter})
            .then(invokation.resolve)
            .catch(invokation.reject);
    }

    processResponse(response: Uint8Array): void {
        if (this.mtprotoHandler) {
            const deserializer = TL.unpacker(response.buffer);
            deserializer.long(); // auth_key_id
            deserializer.long(); // msg_id
            deserializer.int(); // msg_len

            try {
                this.mtprotoHandler.resolve(deserializer);
            } catch (e) {
                this.mtprotoHandler.reject(e);
            }

            this.mtprotoHandler = null;
        } else {
            const response_deserializer = TL.unpacker(response.buffer);

            let auth_key_id = response_deserializer.integer(64);

            if (!compare(auth_key_id, this.authorization.authKeyId)) {
                throw new Error(`${this.dcId} : invalid server auth_key_id`);
            }

            const msg_key = response_deserializer.integer(128);
            const encrypted_data = response_deserializer.rawBytes(response.byteLength - response_deserializer.offset);

            const decrypted = telegram_crypto.decrypt_message(encrypted_data, this.authorization.authKey, msg_key, 8);

            if (!compare(msg_key, decrypted.msg_key)) {
                throw new Error(`${this.dcId} : invalid server msg_key`);
            }

            const decrypted_deserializer = TL.unpacker(decrypted.bytes.buffer);

            const salt = decrypted_deserializer.integer(64);
            const session_id = decrypted_deserializer.integer(64);
            const message_id = decrypted_deserializer.long();

            const seq_no = decrypted_deserializer.int();

            const decrypted_length = decrypted.bytes.byteLength;
            const message_data_length = decrypted_deserializer.int();

            let decrypted_deserializer_offset = decrypted_deserializer.offset;

            if (
                (message_data_length % 4) ||
                (message_data_length > (decrypted_length - decrypted_deserializer_offset))
            ) {
                throw new Error(`${this.dcId} : invalid body length`);
            }

            const message_data = decrypted_deserializer.rawBytes(message_data_length);

            decrypted_deserializer_offset = decrypted_deserializer.offset;

            const padding_length = decrypted_length - decrypted_deserializer_offset;
            if (padding_length < 12 || padding_length > 1024) {
                throw new Error(`${this.dcId} : invalid padding length`);
            }

            const message_deserializer = TL.unpacker(message_data.buffer);
            const message = message_deserializer.object();

            this.processor.process(this, message, message_id, session_id);
        }
    }

    updateServerSalt(new_server_salt: Uint8Array) {
        if (typeof new_server_salt === "string") {
            new_server_salt = new Uint8Array(longToBytes(new_server_salt));
        } else if (!(new_server_salt instanceof Uint8Array)) {
            new_server_salt = new Uint8Array(new_server_salt);
        }

        this.authorization.serverSalt = new_server_salt;

        return keval.auth.setItem(`serverSalt${this.dcId}`, new_server_salt);
    }

    onConnect(socket: SocketTransporter) {
        console.log("connected" + this.dcId);
        this.isSocketConnected = true;
        this.resolveAwaiting();
        this.application.resolveAwaiting();
        if (this.isMain) {
            MTProtoInternal.connectionRestored();
        }
    }

    onDisconnect(socket: SocketTransporter) {
        this.isSocketConnected = false;
        if (this.isMain) {
            MTProtoInternal.connectionLost();
        }
    }

    resolveAwaiting() {
        if (this.isReady) {
            this.awaitingInvokes.forEach(i => {
                const {name, params, resolve, reject} = i;

                this.invokeMethod(name, params)
                    .then(resolve)
                    .catch(reject);
            });
            this.awaitingInvokes = [];
        }
    }
}

export default Connection;