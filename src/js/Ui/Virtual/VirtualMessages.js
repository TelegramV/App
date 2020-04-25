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

import type {Message} from "../../Api/Messages/Message";

// ля, я тільки через три дні зрозумів, що це можна перенести в інший клас.
// і фак, це дико спростило розуміння що відбувається в коді..
class VirtualMessages {
    // oldest first
    messages: Message[] = [];

    size = 60;
    sizeDiv2 = this.size / 2;

    currentPage = [];

    hasMoreOnTopToDownload = true;
    hasMoreOnBottomToDownload = false;
    isDownloading = false;

    refresh() {
        this.hasMoreOnTopToDownload = true;
        this.hasMoreOnBottomToDownload = true;
        this.isDownloading = false;
        this.messages = [];
        this.currentPage = [];
    }

    sliceTop(): Message[] {
        const index = this.messages.findIndex(message => message.id === this.currentPage[0].id);

        if (index > -1) {
            if (index < this.sizeDiv2) {
                return this.messages.slice(0, index);
            }

            return this.messages.slice(index - this.sizeDiv2, index);
        } else {
            console.warn("BUG: [top] no message intersection found");
            return [];
        }
    }

    sliceBottom(): Message[] {
        const index = this.messages.findIndex(message => message.id === this.currentPage[this.currentPage.length - 1].id);

        if (index > -1) {
            if (index + this.sizeDiv2 > this.messages.length) {
                if (index + 1 === this.messages.length) {
                    return [];
                }

                return this.messages.slice(index + 1, this.messages.length);
            }

            return this.messages.slice(index + 1, index + this.sizeDiv2 + 1);
        } else {
            console.warn("BUG: [bottom] no message intersection found");
            return [];
        }
    }

    nextTop(): Message[] {
        const slice = this.sliceTop();
        this.currentPage = slice.concat(this.currentPage.slice(0, this.currentPage.length - slice.length));
        return slice;
    }

    nextBottom(): Message[] {
        const slice = this.sliceBottom();
        this.currentPage = this.currentPage.slice(slice.length).concat(slice);
        return slice;
    }

    isVeryTop() {
        return this.currentPage[0] === this.getVeryTopOne();
    }

    isVeryBottom() {
        return this.currentPage[this.currentPage.length - 1] === this.getVeryBottomOne();
    }

    veryTopPage() {
        if (this.messages.length < this.size) {
            return this.currentPage = this.messages.slice();
        }

        return this.currentPage = this.messages.slice(0, this.size);
    }

    veryBottomPage() {
        if (this.messages.length < this.size) {
            return this.currentPage = this.messages.slice();
        }

        return this.currentPage = this.messages.slice(this.messages.length - this.size);
    }

    getVeryTopOne(): Message {
        return this.messages[0];
    }

    getVeryBottomOne(): Message {
        return this.messages[this.messages.length - 1];
    }

    getPageTopOne(): Message {
        return this.currentPage[0];
    }

    getPageBottomOne(): Message {
        return this.currentPage[this.currentPage.length - 1];
    }

    isEmpty(): boolean {
        return this.messages.length === 0;
    }
}

export default VirtualMessages;