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