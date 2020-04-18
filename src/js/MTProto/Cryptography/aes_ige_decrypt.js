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
import CryptoJS from "../../../../vendor/CryptoJS";

function aes_ige_decrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
    const decrypted = CryptoJS.AES.decrypt({ciphertext: Bytes.toWords(data)}, Bytes.toWords(key), {
        iv: Bytes.toWords(iv),
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    });

    return new Uint8Array(Bytes.fromWords(decrypted));
}

export default aes_ige_decrypt;