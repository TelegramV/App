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

import Bytes from "../Utils/Bytes";
import BigInteger from "big-integer";

function rsa_encrypt(data: Uint8Array, public_key: any): Uint8Array {
    data = Bytes.addPadding(data, 255); // todo: remove

    const N = BigInteger(public_key.modulus, 16);
    const E = BigInteger(public_key.exponent, 16);
    const X = BigInteger.fromArray(Array.from(data), 256, false);

    const encryptedBigInteger = X.modPow(E, N);

    return new Uint8Array(encryptedBigInteger.toArray(256).value);
}

export default rsa_encrypt;