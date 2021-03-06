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

import Rusha from "rusha";

const rusha = new Rusha();

function sha1(data: Uint8Array): Uint8Array {
    return new Uint8Array(rusha.rawDigest(data).buffer);
}
/*
//BRO, WTF, results are unpredictable when length % 4 !== 0
import cryptographySha1 from "@cryptography/sha1"
import Uint8 from "../Utils/Uint8"

function sha1(data: Uint8Array): Uint8Array {
    return Uint8.endian(cryptographySha1(Uint8.toWords(data)).buffer)
}*/

export default sha1;