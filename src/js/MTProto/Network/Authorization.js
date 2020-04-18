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

import Connection from "./Connection"
import Uint8 from "../Utils/Uint8"
import {rsaKeyByFingerprints} from "../Cryptography/rsa_keys"
import decompose_pq from "../Cryptography/decompose_pq"
import TL from "../TypeLanguage/TL"
import sha1 from "../Cryptography/sha1"
import rsa_encrypt from "../Cryptography/rsa_encrypt"
import aes_ige_decrypt from "../Cryptography/aes_ige_decrypt"
import BigInteger from "big-integer"
import aes_ige_encrypt from "../Cryptography/aes_ige_encrypt"

const {concat, compare} = Uint8;

class Authorization {
    authKey: Uint8Array;
    authKeyHash: Uint8Array;
    authKeyId: Uint8Array;
    authKeyAux: Uint8Array;
    serverSalt: Uint8Array;
    sessionId: Uint8Array;

    connection: Connection;

    isAuthorized: boolean;
    isAuthorizing: boolean;

    constructor(connection: Connection, authKey?: Uint8Array) {
        this.connection = connection;

        this.isAuthorizing = false;
        this.isAuthorized = false;

        this.sessionId = Uint8.random(8);

        if (authKey) {
            this.setAuthKey.call(this, authKey);
            this.isAuthorizing = false;
            this.isAuthorized = true;
        }
    }

    setAuthKey(authKey: Uint8Array): void {
        this.authKey = authKey;

        if (this.authKey) {
            this.authKeyHash = sha1(this.authKey);
            this.authKeyAux = this.authKeyHash.slice(0, 8);
            this.authKeyId = this.authKeyHash.slice(-8);
            this.isAuthorizing = false;
            this.isAuthorized = true;
        } else {
            this.isAuthorizing = false;
            this.isAuthorized = true;
        }
    }

    async authorize(force = false): Promise<Uint8Array> {
        const nonce = Uint8.random(16);

        if (!this.authKey || force) {

            console.log("dc" + this.connection.dcId + " : " + "authorizing")

            this.isAuthorized = false;
            this.isAuthorizing = true;

            const resPQ = (await this.connection.invokeMTProtoMethod("req_pq_multi", {
                nonce: nonce,
            })).object("ResPQ");

            console.log("dc" + this.connection.dcId + " : " + "resPQ", resPQ);

            if (!compare(nonce, resPQ.nonce)) {
                throw new Error("Invalid nonce.")
            }

            const publicKey = rsaKeyByFingerprints(resPQ.server_public_key_fingerprints);

            if (!publicKey) {
                throw new Error("No public key found.")
            }

            const decompose_pq_perf_start = performance.now();
            const P_Q = decompose_pq(resPQ.pq);
            console.log("dc" + this.connection.dcId + " : " + "decompose_pq time", performance.now() - decompose_pq_perf_start + "ms.");

            const new_nonce = Uint8.random(32);

            const p_q_inner_data_bytes = TL.pack({
                _: "p_q_inner_data",
                pq: resPQ.pq,
                p: P_Q.p,
                q: P_Q.q,
                nonce: nonce,
                server_nonce: resPQ.server_nonce,
                new_nonce: new_nonce,
            }, "P_Q_inner_data").toUint8Array();

            const p_q_inner_data_hash = concat(sha1(p_q_inner_data_bytes), p_q_inner_data_bytes);

            const p_q_inner_data_encrypted = rsa_encrypt(p_q_inner_data_hash, publicKey);

            const ServerDHParams = (await this.connection.invokeMTProtoMethod("req_DH_params", {
                nonce: nonce,
                server_nonce: resPQ.server_nonce,
                p: P_Q.p,
                q: P_Q.q,
                public_key_fingerprint: publicKey.fingerprint,
                encrypted_data: p_q_inner_data_encrypted
            })).object("Server_DH_Params");

            console.log("dc" + this.connection.dcId + " : " + "ServerDHParams", ServerDHParams);

            if (ServerDHParams._ !== "server_DH_params_ok") {
                throw new Error(ServerDHParams._);
            }

            if (!compare(nonce, ServerDHParams.nonce)) {
                throw new Error("Server_DH_Params invalid nonce");
            }

            if (!compare(resPQ.server_nonce, ServerDHParams.server_nonce)) {
                throw new Error("Server_DH_Params invalid server_nonce");
            }

            const tmp_aes_key = concat(
                sha1(concat(new_nonce, resPQ.server_nonce)),
                sha1(concat(resPQ.server_nonce, new_nonce)).slice(0, 12)
            );

            const tmp_aes_iv = concat(
                sha1(concat(resPQ.server_nonce, new_nonce)).slice(12),
                sha1(concat(new_nonce, new_nonce)),
                new_nonce.slice(0, 4)
            );

            const answer_with_hash = aes_ige_decrypt(ServerDHParams.encrypted_answer, tmp_aes_key, tmp_aes_iv);

            const hash = answer_with_hash.slice(0, 20);
            const answer_with_padding = answer_with_hash.slice(20);

            const Server_DH_inner_data_Deserializer = TL.unpacker(answer_with_padding.buffer);
            const Server_DH_inner_data = Server_DH_inner_data_Deserializer.object("Server_DH_inner_data");

            console.log("dc" + this.connection.dcId + " : " + "Server_DH_inner_data", Server_DH_inner_data);

            if (Server_DH_inner_data._ !== "server_DH_inner_data") {
                throw new Error("server_DH_inner_data invalid response: " + Server_DH_inner_data._)
            }

            if (!compare(nonce, Server_DH_inner_data.nonce)) {
                throw new Error("server_DH_inner_data invalid nonce")
            }

            if (!compare(resPQ.server_nonce, Server_DH_inner_data.server_nonce)) {
                throw new Error("server_DH_inner_data invalid server_nonce")
            }

            const dh_prime_hex = Uint8.toHex(Server_DH_inner_data.dh_prime);
            const g_a_hex = Uint8.toHex(Server_DH_inner_data.g_a);

            if (Server_DH_inner_data.g !== 3 ||
                dh_prime_hex !== "c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b"
            ) {
                // The verified value is from https://core.telegram.org/mtproto/security_guidelines
                throw new Error("DH params are not verified: unknown dh_prime")
            }

            const g_a_Big = BigInteger(g_a_hex, 16);
            const dh_prime_Big = BigInteger(dh_prime_hex, 16);

            if (g_a_Big.compareTo(BigInteger.one) <= 0) {
                throw new Error("gA <= 1");
            }

            if (g_a_Big.compareTo(dh_prime_Big.subtract(BigInteger.one)) >= 0) {
                throw new Error("gA >= dhPrime - 1");
            }

            const two_Big = BigInteger(2);
            const two_pow_2048_64_Big = two_Big.pow(BigInteger(2048 - 64));

            if (g_a_Big.compareTo(two_pow_2048_64_Big) === -1) {
                throw new Error("gA < 2^{2048-64}");
            }

            if (g_a_Big.compareTo(dh_prime_Big.subtract(two_pow_2048_64_Big)) > 0) {
                throw new Error("gA > dhPrime - 2^{2048-64}");
            }

            if (!compare(hash, sha1(answer_with_padding.slice(0, Server_DH_inner_data_Deserializer.offset)))) {
                throw new Error("server_DH_inner_data SHA1-hash mismatch");
            }

            // TODO: uncomment
            this.connection.state.applyServerTime(Server_DH_inner_data.server_time);

            let isAuthorized = false;
            let retry = 0;

            while (!isAuthorized) {
                const g_bytes = Uint8.fromHex(Server_DH_inner_data.g.toString(16));
                const b = Uint8.random(256);
                const g_b = Uint8.modPow(g_bytes, b, Server_DH_inner_data.dh_prime);

                const Client_DH_Inner_Data = TL.pack({
                    _: "client_DH_inner_data",
                    nonce: nonce,
                    server_nonce: resPQ.server_nonce,
                    retry_id: new Uint8Array([0, retry++]),
                    g_b: g_b
                }, "Client_DH_Inner_Data").toUint8Array();

                const data_with_hash = concat(sha1(Client_DH_Inner_Data), Client_DH_Inner_Data);
                const encrypted_data = aes_ige_encrypt(data_with_hash, tmp_aes_key, tmp_aes_iv);

                let Set_client_DH_params_answer = (await this.connection.invokeMTProtoMethod("set_client_DH_params", {
                    nonce: nonce,
                    server_nonce: resPQ.server_nonce,
                    encrypted_data: encrypted_data,
                })).object("Set_client_DH_params_answer");

                console.log("dc" + this.connection.dcId + " : " + "Set_client_DH_params_answer", Set_client_DH_params_answer);

                if (
                    Set_client_DH_params_answer._ !== "dh_gen_ok" &&
                    Set_client_DH_params_answer._ !== "dh_gen_retry" &&
                    Set_client_DH_params_answer._ !== "dh_gen_fail"
                ) {
                    throw new Error(Set_client_DH_params_answer._);
                }

                if (!compare(nonce, Set_client_DH_params_answer.nonce)) {
                    throw new Error("Set_client_DH_params_answer invalid nonce");
                }

                if (!compare(resPQ.server_nonce, Set_client_DH_params_answer.server_nonce)) {
                    throw new Error("Set_client_DH_params_answer bad server_nonce");
                }

                this.setAuthKey(Uint8.modPow(Server_DH_inner_data.g_a, b, Server_DH_inner_data.dh_prime));

                switch (Set_client_DH_params_answer._) {
                    case "dh_gen_ok":
                        console.log("dc" + this.connection.dcId + " : " + "dh_gen_ok");

                        const new_nonce_hash1 = sha1(concat(new_nonce, [1], this.authKeyAux)).slice(-16);

                        if (!compare(new_nonce_hash1, Set_client_DH_params_answer.new_nonce_hash1)) {
                            throw new Error("Set_client_DH_params_answer.new_nonce_hash1 != new_nonce_hash1");
                        }

                        this.serverSalt = Uint8.xor(new_nonce.slice(0, 8), resPQ.server_nonce.slice(0, 8));

                        isAuthorized = true;
                        this.isAuthorized = true;
                        this.isAuthorizing = false;

                        return this.authKey;

                    case "dh_gen_retry":
                        console.warn("dc" + this.connection.dcId + " : " + "dh_gen_retry");

                        const new_nonce_hash2 = sha1(concat(new_nonce, [2], this.authKeyAux)).slice(-16);

                        if (!compare(new_nonce_hash2, Set_client_DH_params_answer.new_nonce_hash2)) {
                            throw new Error("Set_client_DH_params_answer.new_nonce_hash2 != new_nonce_hash2");
                        }

                        isAuthorized = false;

                        break;

                    case "dh_gen_fail":
                        console.error("dc" + this.connection.dcId + " : " + "dh_gen_fail");

                        const new_nonce_hash3 = sha1(concat(new_nonce, [3], this.authKeyAux)).slice(-16);

                        isAuthorized = false;
                        this.isAuthorizing = false;

                        if (!compare(new_nonce_hash3, Set_client_DH_params_answer.new_nonce_hash3)) {
                            throw new Error("Set_client_DH_params_answer.new_nonce_hash3 != new_nonce_hash3");
                        }

                        throw new Error("Set_client_DH_params_answer dh_gen_fail");
                }
            }
        } else {

        }
    }


}

export default Authorization;