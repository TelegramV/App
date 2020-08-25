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

import VButton from "../../Elements/Button/VButton"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import aes_ige_encrypt from "../../../MTProto/Cryptography/aes_ige_encrypt"
import {IGE} from "@cryptography/aes"
import Uint8 from "../../../MTProto/Utils/Uint8"
import sha1 from "../../../MTProto/Cryptography/sha1"
import sha256 from "../../../MTProto/Cryptography/sha256"
import cryptoSha512 from "@cryptography/sha512"
import cryptoSha256 from "@cryptography/sha256"
import cryptoSha1 from "@cryptography/sha1"
import {pbkdf2_sha512} from "../../../MTProto/Cryptography/mt_srp"
import pbkdf2 from "@cryptography/pbkdf2"
import Rusha from "rusha";

export default function IGEPage() {
    return (
        <div>
            <IGETest/>
        </div>
    );
}

class IGETest extends StatefulComponent {

    testData = []
    randomStrings = []
    rusha = new Rusha();

    init() {
        const testCases = 10;
        for(let i = 0; i< testCases; i++) {
            this.testData.push([
                new Uint8Array(this.randomArray(64)),
                new Uint8Array(this.randomArray(32)),
                new Uint8Array(this.randomArray(32))
                ])
        }

        for(let i = 0; i< testCases; i++) {
            this.randomStrings.push(new Uint8Array(this.randomArray(52)))
        }
    }

    render({}, {checked}) {
        window.test = this
        window.rusha = this.rusha
        window.sha1 = cryptoSha1
        window.Uint8 = Uint8
        return (
            <div>
                <VButton onClick={() => {
                    this.testOurIGE()
                }}>Start our IGE encrypt</VButton>
                <VButton onClick={() => {
                    this.testCryptographyIGE();
                }}>Start cryptography IGE encrypt</VButton>
                <br/>
                <VButton onClick={() => {
                    this.testOurSHA512()
                }}>Start our SHA512</VButton>
                <VButton onClick={() => {
                    this.testCryptographySHA512();
                }}>Start cryptography SHA512</VButton>
                <br/>
                <VButton onClick={() => {
                    this.testOurSHA256()
                }}>Start our SHA256</VButton>
                <VButton onClick={() => {
                    this.testCryptographySHA256();
                }}>Start cryptography SHA256</VButton>
                <br/>
                <VButton onClick={() => {
                    this.testOurSHA1()
                }}>Start our SHA1</VButton>
                <VButton onClick={() => {
                    this.testCryptographySHA1();
                }}>Start cryptography SHA1</VButton>

                <br/>
                <VButton onClick={() => {
                    this.testOurPasscheck()
                }}>Start our Passcheck</VButton>
                <VButton onClick={() => {
                    this.testCryptographyPasscheck();
                }}>Start cryptography Passcheck</VButton>
            </div>
        )
    }

    testOurSHA256() {
        const results = [];
        const now = performance.now();
        for(let data of this.randomStrings) {
            results.push(sha256(data))
        }
        console.log("Our SHA256 ", performance.now()-now)
        console.log(results)
    }

    testCryptographySHA256() {
        const results = [];
        const now = performance.now();
        for(let data of this.randomStrings) {
            results.push(Array.from(Uint8.endian(cryptoSha256(Uint8.toWords(data)).buffer)))
        }
        console.log("Cryptography SHA256 ", performance.now()-now)
        console.log(results)
    }

    testOurSHA1() {
        const results = [];
        const now = performance.now();
        for(let data of this.randomStrings) {
            results.push(new Uint8Array(this.rusha.rawDigest(data).buffer))
        }
        console.log("Our SHA1 ", performance.now()-now)
        console.log(results)
    }

    testCryptographySHA1() {
        const results = [];
        const now = performance.now();
        for(let data of this.randomStrings) {
            results.push(Uint8.endian(cryptoSha1(Uint8.toWords(data)).buffer))
        }
        console.log("Cryptography SHA1 ", performance.now()-now)
        console.log(results)
    }

    testOurSHA512() {
        const results = [];
        const now = performance.now();
        for(let data of this.randomStrings) {
            results.push(sha512(data, "array"))
        }
        console.log("Our SHA512 ", performance.now()-now)
        console.log(results)
    }

    testCryptographySHA512() {
        const results = [];
        const now = performance.now();
        for(let data of this.randomStrings) {
            results.push(cryptoSha512(data, "array"))
        }
        console.log("Cryptography SHA512 ", performance.now()-now)
        console.log(results)
    }

    testCryptographyIGE() {
        const results = [];
        const now = performance.now();
        for(let params of this.testData) {
            let text = new IGE(params[1], params[2], 16).encrypt(params[0])
            results.push(Uint8.endian(text.buffer));
        }
        console.log("Cryptography ", performance.now()-now)
        console.log(results)
    }

    testOurIGE() {
        const results = [];
        const now = performance.now();
        for(let params of this.testData) {
            results.push(aes_ige_encrypt(params[0], params[1], params[2]));
        }
        console.log("Our ", performance.now()-now)
        console.log(results)
    }

    randomArray(length) {
        return Array.from({length}, () => Math.floor(Math.random() * 255));
    }

    toWords(bytes) {
        if (bytes instanceof ArrayBuffer) {
            bytes = new Uint8Array(bytes)
        }

        const len = bytes.length
        const words = []

        for (let i = 0; i < len; i++) {
            words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8)
        }
        return new Uint32Array(words);
    }
}