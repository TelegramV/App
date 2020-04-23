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

import type {Message} from "../../../../Api/Messages/Message";

// ля, я тільки через три дні зрозумів, що це можна перенести в інший клас.
// і фак, це дико спростило розуміння що відбувається в коді..
class VirtualMessages {
    messages: Message[] = [];
    offset = 0;

    size = 60;
    sizeDiv2 = this.size / 2;

    refresh() {
        this.messages = [];
        this.offset = 0;
    }

    next(): Message[] {
        let messages;

        if (this.offset === 0) {
            messages = this.messages.slice(0, this.size);
        } else {
            messages = this.messages.slice(this.offset, this.offset + this.size / 2);
        }

        this.offset += messages.length;

        return messages;
    }

    back(): Message[] {
        let messages;

        if (this.offset < (this.size * 1.5)) {
            if (this.offset <= this.size) {
                messages = this.messages.slice(0, this.size / 2);
            } else {
                messages = this.messages.slice(0, this.offset - this.size);
            }
        } else {
            messages = this.messages.slice(this.offset - (this.size * 1.5), this.offset - this.size);
        }

        this.offset -= messages.length;

        if (this.offset < this.size) {
            console.error("suka offset < ", this.size, this.offset)
        }

        return messages;
    }
}

export default VirtualMessages;