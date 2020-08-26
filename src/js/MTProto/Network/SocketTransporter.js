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

import {mt_get_random_num_secure, mt_write_bytes, mt_write_uint32} from "../Cryptography/mt_inob_codec"
//import aesjs from "../../../../vendor/aes"
import {CTR} from "@cryptography/aes"
import Connection from "./Connection"
import Uint8 from "../Utils/Uint8"

export class SocketTransporter {
    constructor(connection: Connection) {
        this.connection = connection;

        this.transportationSocket = new WebSocket(this.connection.dcUrl, "binary");
        this.transportationSocket.binaryType = "arraybuffer";

        this.isConnected = false;
        this.isConnecting = false;

        this.transportationQueue = [];

        this.aes_encryptor = undefined;
        this.aes_decryptor = undefined;
        this.obfuscation_init = undefined;

        this.init_transportation();
    }

    get isReady() {
        return this.isConnected && this.transportationSocket.OPEN;
    }

    refreshSocket() {
        console.log("refreshing socket..", this.connection.dcId);

        this.inob_clear();

        this.transportationSocket = new WebSocket(this.connection.dcUrl, "binary");
        this.transportationSocket.binaryType = "arraybuffer";
        this.isConnected = false;
        this.isConnecting = false;

        this.init_transportation();
    }

    inob_clear() {
        this.obfuscation_init = undefined;
        this.aes_decryptor = undefined;
        this.aes_encryptor = undefined;
    }

    transport(buffer: Buffer) {
        if (!this.isConnected) {
            if (!this.isConnecting) {
                this.transportationQueue.push(buffer);
                this.init_transportation();
                this.isConnecting = true;
            } else {
                this.transportationQueue.push(buffer);
            }

            return;
        }

        this.inob_send(buffer, buffer.byteLength);
    }

    init_transportation() {
        this.transportationSocket.onopen = (ev) => {
            this.isConnected = true;
            this.isConnecting = false;

            while (this.transportationQueue.length) {
                const b = this.transportationQueue.shift();
                this.inob_send(b, b.byteLength);
            }

            // may be bugs
            // for (const b of this.transportationQueue) {
            //     this.inob_send(b, b.byteLength);
            // }
            //
            // this.transportationQueue = [];

            this.onConnect();
        }

        this.transportationSocket.onmessage = (ev) => {
            const data_buffer = this.inob_recv(ev)

            if (data_buffer.byteLength <= 4) {
                //some another protocol violation here
                throw new Error("404?? " + this.connection.dcId)
            }

            this.connection.processResponse.bind(this.connection)(data_buffer)
        }

        this.transportationSocket.onerror = (ev) => {
            console.error("SOCK_ERROR");
        }

        this.transportationSocket.onclose = (ev) => {
            this.isConnected = false;

            console.log("SOCK_CLOSE");

            if (!(ev.wasClean)) {
                console.log("CRASHED");
            }

            console.log(`code: ${ev.code} reason: ${ev.reason}`);

            this.onDisconnect();
        }
    }

    init_obfuscation(out_buffer_view) {
        let out_buffer_offset = 0

        const obfuscation_buffer = new ArrayBuffer(64)
        const obfuscation_buffer_view = new DataView(obfuscation_buffer)
        let obfuscation_buffer_offset = 0

        for (; ;) {
            const f = mt_get_random_num_secure(0xFFFFFFFF)
            const s = mt_get_random_num_secure(0xFFFFFFFF)

            if ((f & 0xFF) !== 0xef && f !== 0xdddddddd && f !== 0xeeeeeeee
                && f !== 0x504f5354 && f !== 0x474554 && f !== 0x48454144 && s !== 0x00000000) {
                mt_write_uint32(obfuscation_buffer_offset, f, obfuscation_buffer_view);
                obfuscation_buffer_offset += 4;
                mt_write_uint32(obfuscation_buffer_offset, s, obfuscation_buffer_view);
                obfuscation_buffer_offset += 4;
                break;
            }
        }

        for (let i = 0; i < 12; ++i) {
            mt_write_uint32(obfuscation_buffer_offset, mt_get_random_num_secure(0xFFFFFFFF), obfuscation_buffer_view);
            obfuscation_buffer_offset += 4;
        }

        mt_write_uint32(obfuscation_buffer_offset, 0xeeeeeeee, obfuscation_buffer_view);
        obfuscation_buffer_offset += 4;

        obfuscation_buffer_view.setUint8(obfuscation_buffer_offset, 0xfe);
        ++obfuscation_buffer_offset;
        obfuscation_buffer_view.setUint8(obfuscation_buffer_offset, 0xff);
        ++obfuscation_buffer_offset;

        obfuscation_buffer_view.setUint16(obfuscation_buffer_offset, mt_get_random_num_secure(0xFFFF));
        obfuscation_buffer_offset += 2;

        for (let i = 0; i < 56; ++i) {
            out_buffer_view.setUint8(out_buffer_offset, obfuscation_buffer_view.getUint8(i));
            ++out_buffer_offset;
        }

        const obf_key_256 = new Uint8Array(obfuscation_buffer.slice(8, 40))
        const obf_vector_128 = new Uint8Array(obfuscation_buffer.slice(40, 56))

        const obfuscation_buffer_u8arr = new Uint8Array(obfuscation_buffer)

        //this.aes_encryptor = new aesjs.ModeOfOperation.ctr(obf_key_256, new aesjs.Counter(obf_vector_128));
        this.aes_encryptor = new CTR(obf_key_256, obf_vector_128);
        const encryptedBytes = Uint8.endian(this.aes_encryptor.encrypt(obfuscation_buffer_u8arr).buffer)

        for (let i = 56; i < 64; ++i) {
            out_buffer_view.setUint8(out_buffer_offset, encryptedBytes[i]);
            ++out_buffer_offset;
        }

        const obfuscation_buffer_reverse = obfuscation_buffer_u8arr.reverse()

        const deobf_key_256 = new Uint8Array(obfuscation_buffer_reverse.slice(8, 40))
        const deobf_vector_128 = new Uint8Array(obfuscation_buffer_reverse.slice(40, 56))

        //this.aes_decryptor = new aesjs.ModeOfOperation.ctr(deobf_key_256, new aesjs.Counter(deobf_vector_128));
        this.aes_decryptor = new CTR(deobf_key_256, deobf_vector_128)
    }

    inob_send_init() {
        const obf_buffer = new ArrayBuffer(64);
        const obf_buffer_view = new DataView(obf_buffer);

        this.init_obfuscation(obf_buffer_view);
        this.transportationSocket.send(obf_buffer);

        this.obfuscation_init = true;
    }

    inob_send(buffer, buffer_len) {
        if (!this.obfuscation_init) {
            this.inob_send_init();
        }

        const out_buffer = new ArrayBuffer(buffer_len + 4);
        const out_buffer_view = new DataView(out_buffer);

        mt_write_uint32(0, buffer_len, out_buffer_view);
        mt_write_bytes(4, buffer_len, new Uint8Array(buffer), out_buffer_view);

        const encrypted_buffer = Uint8.endian(this.aes_encryptor.encrypt(new Uint8Array(out_buffer)).buffer);

        this.transportationSocket.send(encrypted_buffer);
    }

    inob_recv(ev) {
        if (!this.obfuscation_init) {
            return null;
        }

        const decrypted_buffer = Uint8.endian(this.aes_decryptor.decrypt(new Uint8Array(ev.data)).buffer);
        return decrypted_buffer.slice(4);
    }

    onConnect() {
        this.connection.onConnect.call(this.connection, this);
    }

    onDisconnect() {
        this.connection.onDisconnect.call(this.connection, this);
        this.refreshSocket();
    }
}

export default SocketTransporter;