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

import {uintToInt} from "../Utils/Bin";
import type {Invokation} from "./types";
import MTProtoInternal from "../Internal"
import Connection from "./Connection"

function parse_rpc_error(rawError) {
    const matches = (rawError.error_message || "").match(/^([A-Z_0-9]+\b)(: (.+))?/) || [];
    rawError.error_code = uintToInt(rawError.error_code);

    return {
        code: !rawError.error_code || rawError.error_code <= 0 ? 500 : rawError.error_code,
        type: matches[1] || "UNKNOWN",
        originalError: rawError
    };
}

const ALWAYS_DO_RESEND_ON_FLOOD = [
    "messages.getHistory",
    "upload.getFile",
]

class MessagesProcessor {
    connection: Connection;

    pendingInvokations: Map<string, Invokation>;

    constructor(connection: Connection) {
        this.connection = connection;

        this.pendingInvokations = new Map();
    }

    process_pong = (connection: Connection, pong, message_id, session_id) => {
        //
    }

    process_bad_msg_notification = (connection: Connection, bad_msg_notification, message_id, session_id) => {
        // todo: reinvoke
        console.warn("bad_msg_notification", bad_msg_notification, this.pendingInvokations.get(bad_msg_notification.bad_msg_id), "todo: handle it by resending message");
    }

    process_msg_detailed_info = (connection: Connection, msg_detailed_info, message_id, session_id) => {
        // console.warn("msg_detailed_info", msg_detailed_info)
    }

    process_msg_new_detailed_info = (connection: Connection, msg_new_detailed_info, message_id, session_id) => {
        // console.warn("msg_new_detailed_info", msg_new_detailed_info)
    }

    process_new_session_created = (connection: Connection, new_session_created, message_id, session_id) => {
        MTProtoInternal.processUpdate(new_session_created);
    }

    process_bad_server_salt = (connection: Connection, bad_server_salt, message_id, session_id) => {
        connection.updateServerSalt(bad_server_salt.new_server_salt).then(() => {
            connection.reinvoke(bad_server_salt.bad_msg_id);
        });
    }

    process_msgs_ack = (connection: Connection, msgs_ack, message_id, session_id) => {
        connection.ackMessages(msgs_ack.msg_ids);
    }

    process_message = (connection: Connection, message, message_id, session_id) => {
        this.process(connection, message.body, message.msg_id, session_id);
    }

    process_msg_container = (connection: Connection, msg_container, message_id, session_id) => {
        msg_container.messages.forEach(message => {
            this.process(connection, message, message.msg_id, session_id);
        })
    }

    process_rpc_result = (connection: Connection, rpc_result, message_id, session_id) => {
        connection.ackMessages([message_id]);

        const invokation = this.pendingInvokations.get(rpc_result.req_msg_id);

        if (!invokation) {
            console.error("no pending invokation found", rpc_result.req_msg_id, rpc_result.result, this.pendingInvokations);
            return;
        }

        if (rpc_result.result._ === "rpc_error") {
            const error = {
                method: invokation.name,
                params: invokation.params,
                dcId: this.connection.dcId,
                ...parse_rpc_error(rpc_result.result)
            };

            if (error.type && error.type.startsWith("FLOOD_WAIT_")) {
                const fwTime = parseInt(error.type.substring("FLOOD_WAIT_".length));

                if (fwTime <= 30 || ALWAYS_DO_RESEND_ON_FLOOD.includes(invokation.name)) {
                    console.warn(error.type, invokation);

                    return setTimeout(() => connection.reinvoke(rpc_result.req_msg_id), (fwTime * 1000) + 1000);
                }
            } else if (error.code === 500) {
                // next try in 1 second
                console.error("will be reinvoked", error);
                return setTimeout(() => connection.reinvoke(rpc_result.req_msg_id), 1000);
            } else if (error.code === 303) {
                const dcId = parseInt(error.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)[2]);

                return this.connection.application.setMainConnection(dcId).then(connection => {
                    this.pendingInvokations.delete(message_id);

                    console.log("reset done", connection)

                    return connection.invokeMethod(invokation.name, invokation.params, {useSecondTransporter: invokation.useSecondTransporter})
                        .then(invokation.resolve)
                        .catch(invokation.reject);
                });
            }

            invokation.reject(error);
            this.pendingInvokations.delete(rpc_result.req_msg_id);
        } else {
            invokation.resolve(rpc_result.result);
            this.pendingInvokations.delete(rpc_result.req_msg_id);
        }
    }

    process(connection: Connection, message: any, message_id: string, session_id: string) {
        if (!message || !message._) {
            console.error("invalid message", message_id, session_id, message, connection);
            return;
        }

        switch (message._) {
            case "rpc_result":
                return this.process_rpc_result(connection, message, message_id, session_id);
            case "msg_container":
                return this.process_msg_container(connection, message, message_id, session_id);
            case "message":
                return this.process_message(connection, message, message_id, session_id);
            case "pong":
                return this.process_pong(connection, message, message_id, session_id);
            case "msgs_ack":
                return this.process_msgs_ack(connection, message, message_id, session_id);
            case "bad_server_salt":
                return this.process_bad_server_salt(connection, message, message_id, session_id);
            case "new_session_created":
                return this.process_new_session_created(connection, message, message_id, session_id);
            case "msg_new_detailed_info":
                return this.process_msg_new_detailed_info(connection, message, message_id, session_id);
            case "msg_detailed_info":
                return this.process_msg_detailed_info(connection, message, message_id, session_id);
            case "bad_msg_notification":
                return this.process_bad_msg_notification(connection, message, message_id, session_id);
            case "messageEmpty":
                console.log("messageEmpty")
                return null;

            default:
                MTProtoInternal.processUpdate(message);
                return;
        }
    }
}

export default MessagesProcessor;