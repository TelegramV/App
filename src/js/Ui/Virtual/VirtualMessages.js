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

// це було не просто
class VirtualMessages {
    // oldest first
    messages: Message[] = [];

    size = 60;
    sizeDiv2 = this.size / 2;
    edgeSize = 20;

    currentPage = [];
    edges = [null, null];

    hasMoreOnTopToDownload = true;
    hasMoreOnBottomToDownload = false;
    isDownloading = false;

    refresh() {
        this.hasMoreOnTopToDownload = true;
        this.hasMoreOnBottomToDownload = true;
        this.isDownloading = false;
        this.messages = [];
        this.currentPage = [];
        this.edges = [null, null];
    }

    sliceTop(): { index: number; messages: Message[] } {
        const index = this.messages.findIndex(message => message.id === this.currentPage[0].id);

        if (index > -1) {
            if (index < this.sizeDiv2) {
                return {index, messages: this.messages.slice(0, index)};
            }

            return {index, messages: this.messages.slice(index - this.sizeDiv2, index)};
        } else {
            console.warn("BUG: [top] no message intersection found");
            return {index: -1, messages: []};
        }
    }

    sliceBottom(): { index: number; messages: Message[] } {
        const index = this.messages.findIndex(message => message.id === this.currentPage[this.currentPage.length - 1].id);

        if (index > -1) {
            if (index + this.sizeDiv2 > this.messages.length) {
                if (index + 1 === this.messages.length) {
                    return {index, messages: []};
                }

                return {index, messages: this.messages.slice(index + 1, this.messages.length)};
            }

            return {index, messages: this.messages.slice(index + 1, index + this.sizeDiv2 + 1)};
        } else {
            console.warn("BUG: [bottom] no message intersection found");
            return {index: -1, messages: []};
        }
    }

    nextTop(): Message[] {
        const {index, messages} = this.sliceTop();

        if (index <= this.size) {
            this.edges = [null, null];
        } else {
            this.edges = [this.messages[index - this.sizeDiv2 - 1], this.messages[index + 1]];
        }

        console.log("on top edges", this.edges);

        this.currentPage = messages.concat(this.currentPage.slice(0, this.currentPage.length - messages.length));

        return messages;
    }

    nextBottom(): Message[] {
        const {index, messages} = this.sliceBottom();

        if (index <= this.size) {
            this.edges = [null, null];
        } else {
            this.edges = [this.messages[index - this.size - 1], this.messages[index + 1]];
        }

        console.log("on bottom edges", this.edges);

        this.currentPage = this.currentPage.slice(messages.length).concat(messages);

        return messages;
    }

    isVeryTop() {
        return this.currentPage[0] === this.getVeryTopOne();
    }

    isVeryBottom() {
        return this.currentPage[this.currentPage.length - 1] === this.getVeryBottomOne();
    }

    veryTopPage() {
        if (this.messages.length < this.size) {
            this.edges = [null, null];
            return this.currentPage = this.messages.slice();
        }

        this.edges = [this.messages[this.size + 1], null];

        return this.currentPage = this.messages.slice(0, this.size);
    }

    veryBottomPage() {
        if (this.messages.length < this.size) {
            this.edges = [null, null];
            return this.currentPage = this.messages.slice();
        }

        if (this.messages.length === this.size) {
            this.edges = [null, null];
        } else {
            this.edges = [this.messages[this.messages.length - this.size - 1], null];
            console.log(this.edges);
        }

        return this.currentPage = this.messages.slice(this.messages.length - this.size);
    }

    getVeryTopOne(): Message {
        return this.messages[0];
    }

    getVeryBottomOne(): Message {
        return this.messages[this.messages.length - 1];
    }

    getBeforeVeryTopOne(): Message {
        return this.edges[0];
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