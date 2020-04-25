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

// oldest message first
// newest message last

let messages = new Array(1000).fill(null).map((value, index) => index).reverse();

const size = 60;
const sizeDiv2 = size / 2;

let page = messages.slice(messages.length - 60);

function topSlice() {
    const index = messages.findIndex(message => message === page[0]);

    if (index > -1) {
        if (index < sizeDiv2) {
            return messages.slice(0, index);
        }

        return messages.slice(index - sizeDiv2, index);
    } else {
        console.error("BUG: [top] no message intersection found");
        return [];
    }
}

function bottomSlice() {
    const index = messages.findIndex(message => message === page[page.length - 1]);

    if (index > -1) {
        if (index + sizeDiv2 > messages.length) {
            if (index + 1 === messages.length) {
                return [];
            }

            return messages.slice(index + 1, messages.length);
        }

        return messages.slice(index + 1, index + sizeDiv2 + 1);
    } else {
        console.error("BUG: [bottom] no message intersection found");
        return [];
    }
}

function isOk(msgs: [], prev: []) {
    console.log("current page", page);

    expect(msgs.length === 60)
        .toBe(true);

    for (let i = 1; i < msgs.length; i++) {
        expect(msgs[i] - msgs[i - 1])
            .toBe(-1);
    }
}

function topPage() {
    const slice = topSlice();
    if (slice.length > 0) {
        expect(slice[slice.length - 1] - 1).toBe(page[0]);
    }
    page = slice.concat(page.slice(0, page.length - slice.length));
    return page;
}

function bottomPage() {
    const slice = bottomSlice();
    if (slice.length > 0) {
        expect(slice[0] + 1).toBe(page[page.length - 1]);
    }
    page = page.slice(slice.length).concat(slice);
    return page;
}

// test('check all', () => {
//     isOk(messages)
// });

test('check topPage', () => {
    isOk(page)
    isOk(topPage())
    isOk(topPage())
    isOk(topPage())
    isOk(topPage())
    isOk(topPage())
    isOk(topPage())
    // isOk(bottomPage())
    isOk(bottomPage())
    isOk(bottomPage())
    isOk(topPage())
    isOk(topPage())
    isOk(bottomPage())
    isOk(topPage())
    isOk(topPage())
    isOk(topPage())
    isOk(bottomPage())
    isOk(bottomPage())
    isOk(bottomPage())
    isOk(bottomPage())
    isOk(bottomPage())
    isOk(bottomPage())
    isOk(bottomPage())
    isOk(bottomPage())
    isOk(bottomPage())
    isOk(bottomPage())
    isOk(bottomPage())
})