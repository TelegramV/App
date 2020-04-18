/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import Random from "../Utils/Random"
import MTProtoInternal from "../Internal"
import {longFromInts} from "../Utils/Bin"

class ConnectionState {
    lastMessageId: string = [0, 0];
    offset: number = 0;
    seqNo: number = 0;
    connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    generateMessageId(): string {
        const timeTicks = this.now();
        const timeSec = Math.floor(timeTicks / 1000) + this.offset;
        const timeMSec = timeTicks % 1000;
        const random = Random.nextInteger(0xFFFF);

        let messageId = [timeSec, (timeMSec << 21) | (random << 3) | 4];

        if (
            this.lastMessageId[0] > messageId[0] ||
            this.lastMessageId[0] === messageId[0] &&
            this.lastMessageId[1] >= this.lastMessageId[1]
        ) {
            messageId = [this.lastMessageId[0], this.lastMessageId[1] + 4];
        }

        this.lastMessageId = messageId;

        MTProtoInternal.syncTimeWithFrontend();

        return longFromInts(messageId[0], messageId[1]);
    }

    applyServerTime(serverTime: number, localTime: number): void {
        const newTimeOffset = serverTime - Math.floor((localTime || this.now()) / 1000);

        this.lastMessageId = [0, 0];
        this.offset = newTimeOffset;

        MTProtoInternal.syncTimeWithFrontend();
    }

    now(seconds: boolean = false): number {
        const time = +new Date() + this.offset;
        return seconds ? Math.floor(time / 1000) : time;
    }

    generateSeqNo(notContentRelated) {
        let seqNo = this.seqNo * 2;

        if (!notContentRelated) {
            seqNo++;
            this.seqNo++;
        }

        return seqNo;
    }
}

export default ConnectionState;