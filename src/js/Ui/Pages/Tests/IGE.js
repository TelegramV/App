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
import {IGE, CTR} from "@cryptography/aes"
//import aesjs from "../../../../../vendor/aes"
import Uint8 from "../../../MTProto/Utils/Uint8"
import sha1 from "../../../MTProto/Cryptography/sha1"
import sha256 from "../../../MTProto/Cryptography/sha256"
import cryptoSha256 from "@cryptography/sha256"
//import cryptoSha1 from "@cryptography/sha1"
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
                new Uint8Array(this.randomArray(32)),
                new Uint8Array(this.randomArray(16)),
                new Uint8Array(this.randomArray(64))
                ])
        }

        for(let i = 0; i< testCases; i++) {
            this.randomStrings.push(new Uint8Array(this.randomArray(52)))
        }
    }

    render({}, {checked}) {
        window.test = this
        window.ctr = CTR
        window.aes = aesjs
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
                    this.testWebSHA1();
                }}>Start Web SHA1</VButton>
                <br/>
                <VButton onClick={() => {
                    this.testAes()
                }}>Start our AESCTR</VButton>
                <VButton onClick={() => {
                    this.testCryptographyAes();
                }}>Start Cryptography AESCTR</VButton>
            </div>
        )
    }

    testAes() {
    	const results = [];
        const now = performance.now();
    	for(let params of this.testData) {
	    	let aes_encryptor = new aesjs.ModeOfOperation.ctr(params[0], new aesjs.Counter(params[1]));
	    	results.push(aes_encryptor.encrypt(params[2]));
		}
		console.log("Our AES ", performance.now()-now)
        console.log(results)
    }

    async testCryptographyAes() {
    	const results = [];
        const now = performance.now();
    	for(let params of this.testData) {
	    	results.push(Uint8.endian(new CTR(params[0],params[1]).encrypt(params[2]).buffer))
		}
		console.log("Cryptography AES ", performance.now()-now)
        console.log(results)
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

    async testWebSHA1() {
        const results = [];
        const now = performance.now();
        for(let data of this.randomStrings) {
            results.push(await crypto.subtle.digest("SHA-1", data))
        }
        console.log("Web SHA1 ", performance.now()-now)
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