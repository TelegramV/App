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

import BigInteger from "big-integer"

export function bytesFromWords(wordArray) {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const bytes = [];

    for (let i = 0; i < sigBytes; i++) {
        bytes.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
    }

    return bytes;
}

export function longToInts(sLong) {
    const divRem = BigInteger(sLong).divmod(0x100000000);

    return [divRem.quotient.toJSNumber(), divRem.remainder.toJSNumber()];
}

export function longToBytes(sLong) {
    return bytesFromWords({words: longToInts(sLong), sigBytes: 8}).reverse();
}

export function longFromInts(high, low) {
    return BigInteger(high).shiftLeft(32).add(low).toString(10);
}

export function intToUint(val) {
    val = parseInt(val)
    if (val < 0) {
        val = val + 4294967296;
    }

    return val;
}

export function uintToInt(val) {
    if (val > 2147483647) {
        val = val - 4294967296;
    }

    return val;
}