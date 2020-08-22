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

import type {Message} from "./Message"
import {MessageType} from "./Message"
import {AbstractMessage} from "./AbstractMessage"
import {compareFn} from "../../Utils/array"

// shouldn't extend AbstractMessage, but no time as always
class GroupMessage extends AbstractMessage {
    type = MessageType.GROUP;
    messages: Set<Message>;

    constructor(message: Message) {
        super(message.dialogPeer);

        this.jsDate = message.jsDate
        this.messages = new Set([message]);
    }

    init() {
        this.messages.forEach(message => message.init());
    }

    get raw() {
        return this.first?.raw;
    }

    get first() {
        return Array.from(this.messages).sort(compareFn("id", "asc"))[0];
    }

    get newest() {
        return Array.from(this.messages).sort(compareFn("id", "desc"))[0];
    }

    get parsed() {
        return this.first.parsed;
    }

    get prefix() {
        return this.first.prefix;
    }

    add(message: Message) {
        this.messages.add(message);
        this.fire("groupUpdated");
    }
}

export default GroupMessage;