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

import type {Message} from "../../Api/Messages/Message";

class VirtualMessages {
    // oldest first
    messages: Message[] = [];

    size = 60;
    edgeSize = this.size / 2;

    currentPage = [];
    edges = [null, null];

    hasMoreOnTopToDownload = true;
    hasMoreOnBottomToDownload = false;
    isDownloading = false;

    constructor(options) {
        // this.size = options?.size ?? 40;
        // this.edgeSize = 2;
    }

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
            if (index < this.edgeSize) {
                return {index, messages: this.messages.slice(0, index)};
            }

            return {index, messages: this.messages.slice(index - this.edgeSize, index)};
        } else {
            console.warn("BUG: [top] no message intersection found");
            return {index: -1, messages: []};
        }
    }

    sliceBottom(): { index: number; messages: Message[] } {
        const index = this.messages.findIndex(message => message.id === this.currentPage[this.currentPage.length - 1].id);

        if (index > -1) {
            if (index + this.edgeSize > this.messages.length) {
                if (index + 1 === this.messages.length) {
                    return {index, messages: []};
                }

                return {index, messages: this.messages.slice(index + 1, this.messages.length)};
            }

            return {index, messages: this.messages.slice(index + 1, index + this.edgeSize + 1)};
        } else {
            console.warn("BUG: [bottom] no message intersection found");
            return {index: -1, messages: []};
        }
    }

    nextTop(): Message[] {
        const {index, messages} = this.sliceTop();

        if (messages.length < this.edgeSize) {
            this.edges = [null, this.messages[index + this.edgeSize]];
        } else {
            this.edges = [this.messages[index - this.edgeSize - 1], this.messages[index + this.edgeSize]];
        }

        // console.log("on top edges", this.edges);

        this.currentPage = messages.concat(this.currentPage.slice(0, this.currentPage.length - messages.length));

        return messages;
    }

    nextBottom(): Message[] {
        const {index, messages} = this.sliceBottom();

        if (messages.length < this.edgeSize) {
            this.edges = [null, null];
        } else {
            this.edges = [this.messages[index - this.edgeSize], this.messages[index + this.edgeSize + 1]];
        }

        // console.log("on bottom edges", this.edges);

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
        if (this.messages.length <= this.size) {
            this.edges = [null, null];
            return this.currentPage = this.messages.slice();
        }

        this.currentPage = this.messages.slice(this.messages.length - this.size);

        this.edges = [this.currentPage[0], this.currentPage[this.currentPage.length - 1]];

        return this.currentPage;
    }

    getVeryTopOne(): Message {
        return this.messages[0];
    }

    getVeryBottomOne(): Message {
        return this.messages[this.messages.length - 1];
    }

    getBeforePageTopOne(): Message | null {
        return this.edges[0];
    }

    getAfterPageBottomOne(): Message | null {
        return this.edges[1];
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