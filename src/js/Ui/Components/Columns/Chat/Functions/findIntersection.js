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

import type {Message} from "../../../../../Api/Messages/Message"

// returns index on left or -1
function findIntersection(left: Message[], right: Message[]): number {
    if (left.length > right.length) {
        for (const rmessage of right) {

            for (let lindex = 0; lindex < left.length; lindex++) {
                let lmessage = left[lindex];

                if (rmessage.id === lmessage.id) {
                    return lindex;
                }
            }
        }
    } else {
        for (let lindex = 0; lindex < left.length; lindex++) {
            const lmessage = left[lindex];

            for (const rmessage of right) {
                if (lmessage.id === rmessage.id) {
                    return lindex;
                }
            }
        }
    }

    return -1;
}

export default findIntersection;