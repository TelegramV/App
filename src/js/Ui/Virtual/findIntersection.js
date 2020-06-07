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

import type {Message} from "../../Api/Messages/Message"

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