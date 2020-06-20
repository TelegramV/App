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

import MTProtoInternal from "../Internal"
import mt_srp_check_password from "../Cryptography/mt_srp"
import task_invokeMethod from "./tasks/task_invokeMethod"
import task_connect from "./tasks/task_connect"
import task_mt_srp_check_password from "./tasks/task_mt_srp_check_password"
import task_gzipUncompress from "./tasks/task_gzipUncompress"
import task_time_generateMessageId from "./tasks/task_time_generate_message_id"
import task_startCall from "./CallsTasks/task_startCall";
import task_getAuthKey from "./CallsTasks/task_getAuthKey";
import task_generateEmojiFingerprint from "./CallsTasks/task_generateEmojiFingerprint";
import task_decrypt_message from "./CallsTasks/task_decrypt_message";
import task_encrypt_message from "./CallsTasks/task_encrypt_message";
import task_random from "./CallsTasks/task_random";

type Task = {
    id: number,
    name: string,
    data: any,
}

function postMessageWithTime(data) {
    Object.assign(data, {
        time: {
            lastMessageID: MTProtoInternal.application.mainConnection?.state.lastMessageId,
            timeOffset: MTProtoInternal.application.mainConnection?.state.offset,
        }
    })

    postMessage(data)
}

function postSuccess(id: number, data: any) {
    postMessageWithTime({taskId: id, taskResult: data, failed: false})
}

function postFail(id: number, error: any) {
    postMessageWithTime({taskId: id, taskResult: error, failed: true})
}

MTProtoInternal.updatesHandler = update => postMessageWithTime({type: "update", update: update})
MTProtoInternal.workerPostMessage = data => postMessageWithTime(data)

const TASKS: Map<string, Task => any> = new Map()

TASKS.set("invokeMethod", task_invokeMethod)
TASKS.set("connect", task_connect)
TASKS.set("mt_srp_check_password", task_mt_srp_check_password)
TASKS.set("gzipUncompress", task_gzipUncompress)
TASKS.set("time_generateMessageId", task_time_generateMessageId)
TASKS.set("startCall", task_startCall)
TASKS.set("getAuthKey", task_getAuthKey)
TASKS.set("generateEmojiFingerprint", task_generateEmojiFingerprint)
TASKS.set("decrypt_message", task_decrypt_message)
TASKS.set("encrypt_message", task_encrypt_message)
TASKS.set("random", task_random)

self.addEventListener("message", event => {
    const data = event.data

    const task: Task = {
        id: data.taskId,
        name: data.task,
        data: data.taskData,
        success: result => postSuccess(data.taskId, result),
        fail: error => postFail(data.taskId, error),
    }

    const handler = TASKS.get(task.name)

    handler.call(null, task)
})

postMessage("ready")