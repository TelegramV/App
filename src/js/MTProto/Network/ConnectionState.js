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

import Random from "../Utils/Random"
import MTProtoInternal from "../Internal"
import {longFromInts} from "../Utils/Bin"
import Connection from "./Connection"

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