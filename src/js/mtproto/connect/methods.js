import {TLSerialization} from "../language/serialization"
import {bytesToArrayBuffer} from "../utils/bin"
import {rsaEncrypt} from "../crypto/rsa"
import {sha1BytesSync} from "../crypto/sha"
import {TLDeserialization} from "../language/deserialization"
import {BigInteger} from "../vendor/jsbn/jsbn"
import {tsNow} from "../timeManager"
import {createLogger} from "../../common/logger"
import AppCryptoManager from "../crypto/cryptoManager"
import {rsaKeyByFingerprints} from "./rsaKeys"
import Bytes from "../utils/bytes"
import {SecureRandomSingleton} from "../utils/singleton"


const Logger = createLogger("methods.js", {
    level: "debug"
})

export function sendReqPQ(networker) {
    const authContext = networker.auth

    Logger.debug("sendReqPQ requestContext.nonce = ", authContext.nonce)

    Logger.debug(_ => _("Send req_pq", Bytes.asHex(authContext.nonce)))

    // TODO FIXME!
    // chanhing the name of the method doesn't change it's id :) @kohutd
    // shit happens.. @undrfined
    return new Promise(resolve => {
        networker.invokeMethod("req_pq_multi", {
            nonce: authContext.nonce
        }).then(deserializer => {
            const resPQ = deserializer.fetchObject("ResPQ")

            if (resPQ._ !== "resPQ") {
                throw new Error("resPQ response invalid: " + resPQ._)
            }

            if (!Bytes.compare(authContext.nonce, resPQ.nonce)) {
                throw new Error("resPQ nonce mismatch")
            }

            authContext.serverNonce = resPQ.server_nonce
            authContext.pq = resPQ.pq
            authContext.fingerprints = resPQ.server_public_key_fingerprints

            Logger.debug("sendReqPQ requestContext.server_nonce = ", authContext.serverNonce)

            Logger.debug(_ => _("Got ResPQ", Bytes.asHex(authContext.serverNonce), Bytes.asHex(authContext.pq), authContext.fingerprints))

            authContext.publicKey = rsaKeyByFingerprints(authContext.fingerprints)

            if (!authContext.publicKey) {
                throw new Error("No public key found.")
            }

            Logger.log("PQ factorization start", authContext.pq)

            AppCryptoManager.decomposePQ(authContext.pq).then(result => {

                console.log("pq", result)

                authContext.p = result.p
                authContext.q = result.q

                sendReqDhParams(networker).then(resolve)
            })
        })
    })
}

function sendReqDhParams(networker) {
    const authContext = networker.auth

    authContext.newNonce = new Array(32)
    SecureRandomSingleton.nextBytes(authContext.newNonce)

    const dataSerializer = new TLSerialization()
    dataSerializer.storeObject({
        _: "p_q_inner_data",
        pq: authContext.pq,
        p: authContext.p,
        q: authContext.q,
        nonce: authContext.nonce,
        server_nonce: authContext.serverNonce,
        new_nonce: authContext.newNonce
    }, "P_Q_inner_data", "DECRYPTED_DATA")

    const dataWithHash = sha1BytesSync(dataSerializer.getBuffer()).concat(dataSerializer.getBytes())

    Logger.log("Send req_DH_params")

    Logger.debug("sendReqDhParams requestContext.nonce = ", authContext.nonce)
    Logger.debug("sendReqDhParams requestContext.serverNonce = ", authContext.serverNonce)
    Logger.debug("sendReqDhParams requestContext.newNonce = ", authContext.newNonce)

    return new Promise(resolve => {
        networker.invokeMethod("req_DH_params", {
            nonce: authContext.nonce,
            server_nonce: authContext.serverNonce,
            p: authContext.p,
            q: authContext.q,
            public_key_fingerprint: authContext.publicKey.fingerprint,
            encrypted_data: rsaEncrypt(authContext.publicKey, dataWithHash)
        }).then(deserializer => {
            const response = deserializer.fetchObject("Server_DH_Params", "RESPONSE")

            if (response._ !== "server_DH_params_fail" && response._ !== "server_DH_params_ok") {
                throw new Error("Server_DH_Params response invalid: " + response._)
            }

            if (!Bytes.compare(authContext.nonce, response.nonce)) {
                throw new Error("Server_DH_Params nonce mismatch")
            }

            if (!Bytes.compare(authContext.serverNonce, response.server_nonce)) {
                throw new Error("Server_DH_Params server_nonce mismatch")
            }

            if (response._ === "server_DH_params_fail") {
                const newNonceHash = sha1BytesSync(authContext.newNonce).slice(-16)
                if (!Bytes.compare(newNonceHash, response.new_nonce_hash)) {
                    throw new Error("server_DH_params_fail new_nonce_hash mismatch")
                }
                throw new Error("server_DH_params_fail")
            }

            decryptServerDhDataAnswer(networker, response.encrypted_answer).then(() => {

                Logger.debug("sendReqDhParams.then requestContext.nonce = ", authContext.nonce)
                Logger.debug("sendReqDhParams.then requestContext.serverNonce = ", authContext.serverNonce)
                Logger.debug("sendReqDhParams.then requestContext.newNonce = ", authContext.newNonce)

                sendSetClientDhParams(networker).then(resolve)
            })
        })
    })
}

function decryptServerDhDataAnswer(networker, encryptedAnswer) {
    const authContext = networker.auth
    authContext.localTime = tsNow()

    authContext.tmpAesKey = sha1BytesSync(authContext.newNonce.concat(authContext.serverNonce)).concat(sha1BytesSync(authContext.serverNonce.concat(authContext.newNonce)).slice(0, 12))
    authContext.tmpAesIv = sha1BytesSync(authContext.serverNonce.concat(authContext.newNonce)).slice(12).concat(sha1BytesSync([].concat(authContext.newNonce, authContext.newNonce)), authContext.newNonce.slice(0, 4))

    return AppCryptoManager.aesDecrypt(encryptedAnswer, authContext.tmpAesKey, authContext.tmpAesIv).then(answerWithHash => {
        const hash = answerWithHash.slice(0, 20)
        const answerWithPadding = answerWithHash.slice(20)
        const buffer = bytesToArrayBuffer(answerWithPadding)
        // Logger.log("mtpDecryptServerDhDataAnswer", Bytes.asHex(answerWithPadding));

        const deserializer = new TLDeserialization(buffer, {mtproto: true})
        const response = deserializer.fetchObject("Server_DH_inner_data")
        Logger.log(response);

        if (response._ !== "server_DH_inner_data") {
            throw new Error("server_DH_inner_data response invalid: " + constructor)
        }

        if (!Bytes.compare(authContext.nonce, response.nonce)) {
            throw new Error("server_DH_inner_data nonce mismatch")
        }

        if (!Bytes.compare(authContext.serverNonce, response.server_nonce)) {
            throw new Error("server_DH_inner_data serverNonce mismatch")
        }

        Logger.log("Done decrypting answer")
        authContext.g = response.g
        authContext.dhPrime = response.dh_prime
        authContext.gA = response.g_a
        authContext.serverTime = response.server_time
        authContext.retry = 0


        Logger.debug("decryptServerDhDataAnswer requestContext.nonce = ", authContext.nonce)
        Logger.debug("decryptServerDhDataAnswer requestContext.serverNonce = ", authContext.serverNonce)
        Logger.debug("decryptServerDhDataAnswer requestContext.newNonce = ", authContext.newNonce)

        verifyDhParams(authContext.g, authContext.dhPrime, authContext.gA)

        const offset = deserializer.getOffset()

        if (!Bytes.compare(hash, sha1BytesSync(answerWithPadding.slice(0, offset)))) {
            throw new Error("server_DH_inner_data SHA1-hash mismatch")
        }

        networker.timeManager.applyServerTime(authContext.serverTime, authContext.localTime)
    })
}

function verifyDhParams(g, dhPrime, gA) {
    Logger.debug("Verifying DH params")
    const dhPrimeHex = Bytes.asHex(dhPrime)
    if (Number(g) !== 3 ||
        dhPrimeHex !== "c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b") {
        // The verified value is from https://core.telegram.org/mtproto/security_guidelines
        throw new Error("DH params are not verified: unknown dhPrime")
    }
    Logger.debug("dhPrime cmp OK")

    const gABigInt = new BigInteger(Bytes.asHex(gA), 16)
    const dhPrimeBigInt = new BigInteger(dhPrimeHex, 16)

    if (gABigInt.compareTo(BigInteger.ONE) <= 0) {
        throw new Error("DH params are not verified: gA <= 1")
    }

    if (gABigInt.compareTo(dhPrimeBigInt.subtract(BigInteger.ONE)) >= 0) {
        throw new Error("DH params are not verified: gA >= dhPrime - 1")
    }
    Logger.debug("1 < gA < dhPrime-1 OK")


    const two = new BigInteger(null)
    two.fromInt(2)
    const twoPow = two.pow(2048 - 64)

    if (gABigInt.compareTo(twoPow) < 0) {
        throw new Error("DH params are not verified: gA < 2^{2048-64}")
    }
    if (gABigInt.compareTo(dhPrimeBigInt.subtract(twoPow)) >= 0) {
        throw new Error("DH params are not verified: gA > dhPrime - 2^{2048-64}")
    }
    Logger.debug("2^{2048-64} < gA < dhPrime-2^{2048-64} OK")

    return true
}

function sendSetClientDhParams(networker, processor, proc_context) {
    const authContext = networker.auth
    Logger.warn("sendSetClientDhParams", authContext)

    const gBytes = Bytes.fromHex(authContext.g.toString(16))

    authContext.b = new Array(256)
    SecureRandomSingleton.nextBytes(authContext.b)

    const gB = Bytes.modPow(gBytes, authContext.b, authContext.dhPrime)

    const data = new TLSerialization()
    data.storeObject({
        _: "client_DH_inner_data",
        nonce: authContext.nonce,
        server_nonce: authContext.serverNonce,
        retry_id: [0, authContext.retry++],
        g_b: gB
    }, "Client_DH_Inner_Data")

    const dataWithHash = sha1BytesSync(data.getBuffer()).concat(data.getBytes())
    Logger.debug("mtpSendSetClientDhParams", dataWithHash, authContext);

    // const encryptedData = aesEncryptSync(dataWithHash, authContext.tmpAesKey, authContext.tmpAesIv)

    return AppCryptoManager.aesEncrypt(dataWithHash, authContext.tmpAesKey, authContext.tmpAesIv).then(encryptedData => {
        Logger.debug("sendSetClientDhParams requestContext.nonce = ", authContext.nonce)
        Logger.debug("sendSetClientDhParams requestContext.serverNonce = ", authContext.serverNonce)
        Logger.debug("sendSetClientDhParams requestContext.newNonce = ", authContext.newNonce)

        Logger.debug("Send set_client_DH_params")

        return new Promise(resolve => {
            networker.invokeMethod("set_client_DH_params", {
                nonce: authContext.nonce,
                server_nonce: authContext.serverNonce,
                encrypted_data: encryptedData
            }).then(deserializer => {
                const response = deserializer.fetchObject("Set_client_DH_params_answer")


                Logger.debug("sendSetClientDhParams.then requestContext.nonce = ", authContext.nonce)
                Logger.debug("sendSetClientDhParams.then requestContext.serverNonce = ", authContext.serverNonce)
                Logger.debug("sendSetClientDhParams.then requestContext.newNonce = ", authContext.newNonce)

                if (response._ !== "dh_gen_ok" && response._ !== "dh_gen_retry" && response._ !== "dh_gen_fail") {
                    throw new Error("Set_client_DH_params_answer response invalid: " + response._)
                }

                if (!Bytes.compare(authContext.nonce, response.nonce)) {
                    throw new Error("Set_client_DH_params_answer nonce mismatch")
                }

                if (!Bytes.compare(authContext.serverNonce, response.server_nonce)) {
                    throw new Error("Set_client_DH_params_answer server_nonce mismatch")
                }

                const authKey = Bytes.modPow(authContext.gA, authContext.b, authContext.dhPrime)

                Logger.debug("GOT auth key!", authKey);

                Logger.debug("SHIT", authContext.gA, authContext.b, authContext.dhPrime)

                const authKeyHash = sha1BytesSync(authKey)
                const authKeyAux = authKeyHash.slice(0, 8)
                const authKeyID = authKeyHash.slice(-8)

                Logger.debug("Got Set_client_DH_params_answer", response._)
                switch (response._) {
                    case "dh_gen_ok":
                        const newNonceHash1 = sha1BytesSync(authContext.newNonce.concat([1], authKeyAux)).slice(-16)

                        Logger.debug(_ => _(Bytes.asHex(authKey)))

                        /**
                         * FIXME: ...
                         */
                        if (!Bytes.compare(newNonceHash1, response.new_nonce_hash1)) {
                            throw new Error("Set_client_DH_params_answer new_nonce_hash1 mismatch")
                        }

                        const serverSalt = Bytes.xor(authContext.newNonce.slice(0, 8), authContext.serverNonce.slice(0, 8))
                        // Logger.log("Auth successfull!", authKeyID, authKey, serverSalt)

                        authContext.authKeyID = authKeyID
                        authContext.authKey = authKey
                        authContext.serverSalt = serverSalt
                        Logger.debug("GOT EVERYTHING! ", authContext)

                        // deferred.resolve(auth)
                        break

                    case "dh_gen_retry":
                        const newNonceHash2 = sha1BytesSync(authContext.newNonce.concat([2], authKeyAux)).slice(-16)
                        if (!Bytes.compare(newNonceHash2, response.new_nonce_hash2)) {
                            throw new Error("Set_client_DH_params_answer new_nonce_hash2 mismatch")
                        }

                        return sendSetClientDhParams(authContext, function () {
                            processor.call(proc_context);
                        }, this);

                    case "dh_gen_fail":
                        const newNonceHash3 = sha1BytesSync(authContext.newNonce.concat([3], authKeyAux)).slice(-16)
                        if (!Bytes.compare(newNonceHash3, response.new_nonce_hash3)) {
                            throw new Error("Set_client_DH_params_answer new_nonce_hash3 mismatch")
                        }

                        throw new Error("Set_client_DH_params_answer fail")
                }
                resolve()
            })
        })
    })
}
