import {TLSerialization} from "../language/serialization"
import {
    bigint,
    bigStringInt,
    bytesCmp, bytesFromArrayBuffer,
    bytesFromHex,
    bytesModPow,
    bytesToArrayBuffer,
    bytesToHex,
    bytesXor, longFromInts,
    secureRandom
} from "../utils/bin"
import {rsaEncrypt} from "../crypto/rsa"
import {sha1BytesSync} from "../crypto/sha"
import {TLDeserialization} from "../language/deserialization"
import {BigInteger} from "../vendor/jsbn/jsbn"
import TimeManager, {tsNow} from "../timeManager"
import {createLogger} from "../../common/logger"
import AppCryptoManager from "../crypto/cryptoManager"


const Logger = createLogger("methods.js", {
    level: "warn"
})

const publicKeysHex = [
    {
        modulus: "c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e580230e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d866b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde74a5bfc920f6abf59ba5c75506373e7130f9042da922179251f",
        exponent: "010001"
    },
    {
        modulus: "aeec36c8ffc109cb099624685b97815415657bd76d8c9c3e398103d7ad16c9bba6f525ed0412d7ae2c2de2b44e77d72cbf4b7438709a4e646a05c43427c7f184debf72947519680e651500890c6832796dd11f772c25ff8f576755afe055b0a3752c696eb7d8da0d8be1faf38c9bdd97ce0a77d3916230c4032167100edd0f9e7a3a9b602d04367b689536af0d64b613ccba7962939d3b57682beb6dae5b608130b2e52aca78ba023cf6ce806b1dc49c72cf928a7199d22e3d7ac84e47bc9427d0236945d10dbd15177bab413fbf0edfda09f014c7a7da088dde9759702ca760af2b8e4e97cc055c617bd74c3d97008635b98dc4d621b4891da9fb0473047927",
        exponent: "010001"
    },
    {
        modulus: "bdf2c77d81f6afd47bd30f29ac76e55adfe70e487e5e48297e5a9055c9c07d2b93b4ed3994d3eca5098bf18d978d54f8b7c713eb10247607e69af9ef44f38e28f8b439f257a11572945cc0406fe3f37bb92b79112db69eedf2dc71584a661638ea5becb9e23585074b80d57d9f5710dd30d2da940e0ada2f1b878397dc1a72b5ce2531b6f7dd158e09c828d03450ca0ff8a174deacebcaa22dde84ef66ad370f259d18af806638012da0ca4a70baa83d9c158f3552bc9158e69bf332a45809e1c36905a5caa12348dd57941a482131be7b2355a5f4635374f3bd3ddf5ff925bf4809ee27c1e67d9120c5fe08a9de458b1b4a3c5d0a428437f2beca81f4e2d5ff",
        exponent: "010001"
    },
    {
        modulus: "b3f762b739be98f343eb1921cf0148cfa27ff7af02b6471213fed9daa0098976e667750324f1abcea4c31e43b7d11f1579133f2b3d9fe27474e462058884e5e1b123be9cbbc6a443b2925c08520e7325e6f1a6d50e117eb61ea49d2534c8bb4d2ae4153fabe832b9edf4c5755fdd8b19940b81d1d96cf433d19e6a22968a85dc80f0312f596bd2530c1cfb28b5fe019ac9bc25cd9c2a5d8a0f3a1c0c79bcca524d315b5e21b5c26b46babe3d75d06d1cd33329ec782a0f22891ed1db42a1d6c0dea431428bc4d7aabdcf3e0eb6fda4e23eb7733e7727e9a1915580796c55188d2596d2665ad1182ba7abf15aaa5a8b779ea996317a20ae044b820bff35b6e8a1",
        exponent: "010001"
    },
    {
        modulus: "be6a71558ee577ff03023cfa17aab4e6c86383cff8a7ad38edb9fafe6f323f2d5106cbc8cafb83b869cffd1ccf121cd743d509e589e68765c96601e813dc5b9dfc4be415c7a6526132d0035ca33d6d6075d4f535122a1cdfe017041f1088d1419f65c8e5490ee613e16dbf662698c0f54870f0475fa893fc41eb55b08ff1ac211bc045ded31be27d12c96d8d3cfc6a7ae8aa50bf2ee0f30ed507cc2581e3dec56de94f5dc0a7abee0be990b893f2887bd2c6310a1e0a9e3e38bd34fded2541508dc102a9c9b4c95effd9dd2dfe96c29be647d6c69d66ca500843cfaed6e440196f1dbe0e2e22163c61ca48c79116fa77216726749a976a1c4b0944b5121e8c01",
        exponent: "010001"
    }
]

let publicKeysParsed = {}
let prepared = false

function prepareRsaKeys() {
    if(prepared) return
    for (let i = 0; i < publicKeysHex.length; i++) {
        let keyParsed = publicKeysHex[i]

        let rsaPublicKeySerializer = new TLSerialization()
        rsaPublicKeySerializer.storeBytes(bytesFromHex(keyParsed.modulus), "n")
        rsaPublicKeySerializer.storeBytes(bytesFromHex(keyParsed.exponent), "e")

        let buffer = rsaPublicKeySerializer.getBuffer()

        let fingerprintBytes = sha1BytesSync(buffer).slice(-8)
        fingerprintBytes.reverse()

        publicKeysParsed[bytesToHex(fingerprintBytes)] = {
            modulus: keyParsed.modulus,
            exponent: keyParsed.exponent
        }
    }

    prepared = true
}

function selectRsaKeyByFingerPrint(fingerprints) {
    prepareRsaKeys()

    for (let i = 0; i < fingerprints.length; i++) {
        let fingerprintHex = bigStringInt(fingerprints[i]).toString(16)
        let foundKey = publicKeysParsed[fingerprintHex]

        if (foundKey) {
            return Object.assign({fingerprint: fingerprints[i]}, foundKey)
        }
    }

    return false
}

export function sendReqPQ(networker) {
    const authContext = networker.auth

    Logger.debug("sendReqPQ requestContext.nonce = ", authContext.nonce)

    Logger.debug("Send req_pq", bytesToHex(authContext.nonce))

    // TODO FIXME!
    // chanhing the name of the method doesn't change it's id :) @kohutd
    // shit happens.. @undrfined
    return new Promise(resolve => {
        networker.invokeMethod("req_pq_multi", {
            nonce: authContext.nonce
        }).then(deserializer => {
            const resPQ = deserializer.fetchObject("ResPQ")

            if (resPQ._ !== "resPQ") {
                throw new Error("[MT] resPQ response invalid: " + resPQ._)
            }

            if (!bytesCmp(authContext.nonce, resPQ.nonce)) {
                throw new Error("[MT] resPQ nonce mismatch")
            }

            authContext.serverNonce = resPQ.server_nonce
            authContext.pq = resPQ.pq
            authContext.fingerprints = resPQ.server_public_key_fingerprints

            Logger.debug("sendReqPQ requestContext.server_nonce = ", authContext.serverNonce)

            Logger.debug("Got ResPQ", bytesToHex(authContext.serverNonce), bytesToHex(authContext.pq), authContext.fingerprints)

            authContext.publicKey = selectRsaKeyByFingerPrint(authContext.fingerprints)

            if (!authContext.publicKey) {
                throw new Error("[MT] No public key found")
            }

            Logger.log("PQ factorization start", authContext.pq)

            AppCryptoManager.findPQ(authContext.pq).then(result => {

                authContext.p = result.p
                authContext.q = result.q


                sendReqDhParams(networker).then(resolve)
            })
        })
    })
}

function sendReqDhParams(networker, processor, proc_context) {
    const authContext = networker.auth

    authContext.newNonce = new Array(32)
    secureRandom().nextBytes(authContext.newNonce)

    const dataSerializer = new TLSerialization({mtproto: true})
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
                throw new Error("[MT] Server_DH_Params response invalid: " + response._)
            }

            if (!bytesCmp(authContext.nonce, response.nonce)) {
                throw new Error("[MT] Server_DH_Params nonce mismatch")
            }

            if (!bytesCmp(authContext.serverNonce, response.server_nonce)) {
                throw new Error("[MT] Server_DH_Params server_nonce mismatch")
            }

            if (response._ === "server_DH_params_fail") {
                const newNonceHash = sha1BytesSync(authContext.newNonce).slice(-16)
                if (!bytesCmp(newNonceHash, response.new_nonce_hash)) {
                    throw new Error("[MT] server_DH_params_fail new_nonce_hash mismatch")
                }
                throw new Error("[MT] server_DH_params_fail")
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
        // Logger.log("mtpDecryptServerDhDataAnswer", bytesToHex(answerWithPadding));

        const deserializer = new TLDeserialization(buffer, {mtproto: true})
        const response = deserializer.fetchObject("Server_DH_inner_data")
        Logger.log(response);

        if (response._ !== "server_DH_inner_data") {
            throw new Error("[MT] server_DH_inner_data response invalid: " + constructor)
        }

        if (!bytesCmp(authContext.nonce, response.nonce)) {
            throw new Error("[MT] server_DH_inner_data nonce mismatch")
        }

        if (!bytesCmp(authContext.serverNonce, response.server_nonce)) {
            throw new Error("[MT] server_DH_inner_data serverNonce mismatch")
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

        if (!bytesCmp(hash, sha1BytesSync(answerWithPadding.slice(0, offset)))) {
            throw new Error("[MT] server_DH_inner_data SHA1-hash mismatch")
        }

        networker.timeManager.applyServerTime(authContext.serverTime, authContext.localTime)
    })
}

function verifyDhParams(g, dhPrime, gA) {
    Logger.debug("Verifying DH params")
    const dhPrimeHex = bytesToHex(dhPrime)
    if (Number(g) !== 3 ||
        dhPrimeHex !== "c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b") {
        // The verified value is from https://core.telegram.org/mtproto/security_guidelines
        throw new Error("[MT] DH params are not verified: unknown dhPrime")
    }
    Logger.debug("dhPrime cmp OK")

    const gABigInt = new BigInteger(bytesToHex(gA), 16)
    const dhPrimeBigInt = new BigInteger(dhPrimeHex, 16)

    if (gABigInt.compareTo(BigInteger.ONE) <= 0) {
        throw new Error("[MT] DH params are not verified: gA <= 1")
    }

    if (gABigInt.compareTo(dhPrimeBigInt.subtract(BigInteger.ONE)) >= 0) {
        throw new Error("[MT] DH params are not verified: gA >= dhPrime - 1")
    }
    Logger.debug("1 < gA < dhPrime-1 OK")


    const two = new BigInteger(null)
    two.fromInt(2)
    const twoPow = two.pow(2048 - 64)

    if (gABigInt.compareTo(twoPow) < 0) {
        throw new Error("[MT] DH params are not verified: gA < 2^{2048-64}")
    }
    if (gABigInt.compareTo(dhPrimeBigInt.subtract(twoPow)) >= 0) {
        throw new Error("[MT] DH params are not verified: gA > dhPrime - 2^{2048-64}")
    }
    Logger.debug("2^{2048-64} < gA < dhPrime-2^{2048-64} OK")

    return true
}

function sendSetClientDhParams(networker, processor, proc_context) {
    const authContext = networker.auth
    Logger.warn("sendSetClientDhParams", authContext)

    const gBytes = bytesFromHex(authContext.g.toString(16))

    authContext.b = new Array(256)
    secureRandom().nextBytes(authContext.b)

    const gB = bytesModPow(gBytes, authContext.b, authContext.dhPrime)

    const data = new TLSerialization({mtproto: true})
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
                    throw new Error("[MT] Set_client_DH_params_answer response invalid: " + response._)
                }

                if (!bytesCmp(authContext.nonce, response.nonce)) {
                    throw new Error("[MT] Set_client_DH_params_answer nonce mismatch")
                }

                if (!bytesCmp(authContext.serverNonce, response.server_nonce)) {
                    throw new Error("[MT] Set_client_DH_params_answer server_nonce mismatch")
                }

                const authKey = bytesModPow(authContext.gA, authContext.b, authContext.dhPrime)

                Logger.debug("GOT auth key!", authKey);

                Logger.debug("SHIT", authContext.gA, authContext.b, authContext.dhPrime)

                const authKeyHash = sha1BytesSync(authKey)
                const authKeyAux = authKeyHash.slice(0, 8)
                const authKeyID = authKeyHash.slice(-8)

                Logger.debug("Got Set_client_DH_params_answer", response._)
                switch (response._) {
                    case "dh_gen_ok":
                        const newNonceHash1 = sha1BytesSync(authContext.newNonce.concat([1], authKeyAux)).slice(-16)

                        /**
                         * FIXME: ...
                         */
                        if (!bytesCmp(newNonceHash1, response.new_nonce_hash1)) {
                            throw new Error("[MT] Set_client_DH_params_answer new_nonce_hash1 mismatch")
                        }

                        const serverSalt = bytesXor(authContext.newNonce.slice(0, 8), authContext.serverNonce.slice(0, 8))
                        // Logger.log("Auth successfull!", authKeyID, authKey, serverSalt)

                        authContext.authKeyID = authKeyID
                        authContext.authKey = authKey
                        authContext.serverSalt = serverSalt
                        Logger.debug("GOT EVERYTHING! ", authContext)

                        // deferred.resolve(auth)
                        break

                    case "dh_gen_retry":
                        const newNonceHash2 = sha1BytesSync(authContext.newNonce.concat([2], authKeyAux)).slice(-16)
                        if (!bytesCmp(newNonceHash2, response.new_nonce_hash2)) {
                            throw new Error("[MT] Set_client_DH_params_answer new_nonce_hash2 mismatch")
                        }

                        return sendSetClientDhParams(authContext, function () {
                            processor.call(proc_context);
                        }, this);

                    case "dh_gen_fail":
                        const newNonceHash3 = sha1BytesSync(authContext.newNonce.concat([3], authKeyAux)).slice(-16)
                        if (!bytesCmp(newNonceHash3, response.new_nonce_hash3)) {
                            throw new Error("[MT] Set_client_DH_params_answer new_nonce_hash3 mismatch")
                        }

                        throw new Error("[MT] Set_client_DH_params_answer fail")
                }
                resolve()
            })
        })
    })
}