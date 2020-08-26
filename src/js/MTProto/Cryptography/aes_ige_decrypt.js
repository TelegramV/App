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

/*import Bytes from "../Utils/Bytes";
import CryptoJS from "../../../../vendor/CryptoJS";*/
import {IGE} from "@cryptography/aes"
import Uint8 from "../Utils/Uint8"

function aes_ige_decrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
    /*const decrypted = CryptoJS.AES.decrypt({ciphertext: Bytes.toWords(data)}, Bytes.toWords(key), {
        iv: Bytes.toWords(iv),
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    });

    return new Uint8Array(Bytes.fromWords(decrypted));*/
    return Uint8.endian(new IGE(key, iv).decrypt(data).buffer);
}

export default aes_ige_decrypt;