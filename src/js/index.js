import {TLDeserialization, TLSerialization} from "./serializer"
import {createNonce, createSHAHash, modPow} from "./util"
import axios from "axios"
import {
    aesDecryptSync,
    bigStringInt,
    bytesCmp,
    bytesFromHex,
    bytesToArrayBuffer,
    bytesToHex,
    rsaEncrypt,
    secureRandom,
    sha1BytesSync
} from "./bin_utils"
import {PQFinder} from "./pq-finder"
import {aesEncrypt} from "./cipher"
import TimeManager, {tsNow} from "./timeManager"

var BigInteger = require("jsbn");

class MtpDcConfigurator {
    constructor() {
        this.sslSubdomains = ["pluto", "venus", "aurora", "vesta", "flora"]

        this.dcOptions = [
            {id: 0, host: "149.154.167.40", port: 80},
            {id: 1, host: "149.154.175.50", port: 80},
            {id: 2, host: "149.154.167.51", port: 80},
            {id: 3, host: "149.154.175.100", port: 80},
            {id: 4, host: "149.154.167.91", port: 80},
            {id: 5, host: "149.154.171.5", port: 80}
        ]

        this.chosenServers = {}
    }


    chooseServer(dcID, upload) {
        if (this.chosenServers[dcID] === undefined) {
            var chosenServer = false,
                i, dcOption

            if (false) {
                var subdomain = this.sslSubdomains[dcID - 1] + (upload ? "-1" : "")
                var path = "apiw1_test"
                chosenServer = "https://" + subdomain + ".web.telegram.org/" + path
                return chosenServer
            }

            for (i = 0; i < this.dcOptions.length; i++) {
                dcOption = this.dcOptions[i]
                if (dcOption.id == dcID) {
                    chosenServer = "http://" + dcOption.host + (dcOption.port != 80 ? ":" + dcOption.port : "") + "/apiw1_test"
                    break
                }
            }
            this.chosenServers[dcID] = chosenServer
        }

        return this.chosenServers[dcID]
    }
}

const DataCenter = new MtpDcConfigurator()

const config = {
    id: 196813,
    hash: "43480cc21fbf059d3037140217683aaa",
    layer: 107,
    version: "1.0.1"
}

const ts = {
    offset: null
}

const publisKeysHex = [
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
    },
]

let publicKeysParsed = {}
let prepared = false

function prepareRsaKeys() {

    for (let i = 0; i < publisKeysHex.length; i++) {
        let keyParsed = publisKeysHex[i]

        let rsaPublicKeySerializer = new TLSerialization()
        rsaPublicKeySerializer.storeBytes(bytesFromHex(keyParsed.modulus), "n")
        rsaPublicKeySerializer.storeBytes(bytesFromHex(keyParsed.exponent), "e")

        let buffer = rsaPublicKeySerializer.getBuffer()

        let fingerprintBytes = createSHAHash(buffer, "sha1").slice(-8)
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

    let fingerprintHex, foundKey, i
    for (i = 0; i < fingerprints.length; i++) {
        fingerprintHex = bigStringInt(fingerprints[i]).toString(16)
        if (foundKey = publicKeysParsed[fingerprintHex]) {
            return Object.assign({fingerprint: fingerprints[i]}, foundKey)
        }
    }

    return false
}

const authKeyId = 0
const messageId = TimeManager.generateMessageID()
const auth = {
    dcID: 0,
    nonce: createNonce(16)
}

delete axios.defaults.headers.post["Content-Type"]
delete axios.defaults.headers.common["Accept"]

function mtpSendPlainRequest(dcID, requestBuffer) {
    const chromeMatches = navigator.userAgent.match(/Chrome\/(\d+(\.\d+)?)/)
    const chromeVersion = chromeMatches && parseFloat(chromeMatches[1]) || false
    const xhrSendBuffer = !("ArrayBufferView" in window) && (chromeVersion > 0 && chromeVersion < 30)


    const requestLength = requestBuffer.byteLength
    const requestArray = new Int32Array(requestBuffer)

    const serializer = new TLSerialization()
    serializer.storeLongP(0, 0, "auth_key_id")
    serializer.storeLong(TimeManager.generateMessageID(), "msg_id")
    serializer.storeInt(requestLength, "request_length")

    const serializerBuffer = serializer.getBuffer()
    const serializerArray = new Int32Array(serializerBuffer)
    const headerLength = serializerBuffer.byteLength

    const resultBuffer = new ArrayBuffer(headerLength + requestLength)
    const resultArray = new Int32Array(resultBuffer)

    resultArray.set(serializerArray)
    resultArray.set(requestArray, serializerArray.length)

    const requestData = xhrSendBuffer ? resultBuffer : resultArray

    const url = DataCenter.chooseServer(dcID)

    return axios.post(url, requestData, {
        responseType: "arraybuffer",
        transformRequest: null
    }).then(result => {
        const deserializer = new TLDeserialization(result.data, {mtproto: true})
        const auth_key_id = deserializer.fetchLong("auth_key_id")
        const msg_id = deserializer.fetchLong("msg_id")
        const msg_len = deserializer.fetchInt("msg_len")

        return {result, deserializer, auth_key_id, msg_id, msg_len}
    })
}

function mtpSendReqPQ(auth) {
    const messageSerializer = new TLSerialization({mtproto: true})

    messageSerializer.storeMethod("req_pq_multi", {
        nonce: auth.nonce
    });

    console.debug("Send req_pq", bytesToHex(auth.nonce))

    mtpSendPlainRequest(auth.dcID, messageSerializer.getBuffer()).then(({deserializer}) => {
        const resPQ = deserializer.fetchObject("ResPQ")

        if (resPQ._ !== "resPQ") {
            throw new Error("[MT] resPQ response invalid: " + resPQ._)
        }

        if (!bytesCmp(auth.nonce, resPQ.nonce)) {
            throw new Error("[MT] resPQ nonce mismatch")
        }

        auth.serverNonce = resPQ.server_nonce
        auth.pq = resPQ.pq
        auth.fingerprints = resPQ.server_public_key_fingerprints

        console.log("Got ResPQ", bytesToHex(auth.serverNonce), bytesToHex(auth.pq), auth.fingerprints)

        auth.publicKey = selectRsaKeyByFingerPrint(auth.fingerprints)

        if (!auth.publicKey) {
            throw new Error("[MT] No public key found")
        }

        console.log("PQ factorization start", auth.pq)
        const pqFinder = new PQFinder(auth.pq)
        const pAndQ = pqFinder.findPQ()

        auth.p = pqFinder.getPQAsBuffer()[0]
        auth.q = pqFinder.getPQAsBuffer()[1]

        mtpSendReqDhParams(auth)
    })
}

function mtpSendReqDhParams(auth) {
    auth.newNonce = new Array(32)
    secureRandom().nextBytes(auth.newNonce)

    const data = new TLSerialization({mtproto: true})

    data.storeObject({
        _: "p_q_inner_data",
        pq: auth.pq,
        p: auth.p,
        q: auth.q,
        nonce: auth.nonce,
        server_nonce: auth.serverNonce,
        new_nonce: auth.newNonce
    }, "P_Q_inner_data", "DECRYPTED_DATA")

    const dataWithHash = sha1BytesSync(data.getBuffer()).concat(data.getBytes())

    const request = new TLSerialization({mtproto: true})

    request.storeMethod("req_DH_params", {
        nonce: auth.nonce,
        server_nonce: auth.serverNonce,
        p: auth.p,
        q: auth.q,
        public_key_fingerprint: auth.publicKey.fingerprint,
        encrypted_data: rsaEncrypt(auth.publicKey, dataWithHash)
    })

    console.log("Send req_DH_params")

    console.log({
        nonce: auth.nonce,
        server_nonce: auth.serverNonce,
        p: auth.p,
        q: auth.q,
        public_key_fingerprint: Number(auth.publicKey.fingerprint),
        encrypted_data: rsaEncrypt(auth.publicKey, dataWithHash)
    })

    mtpSendPlainRequest(auth.dcID, request.getBuffer()).then(({deserializer}) => {
        const response = deserializer.fetchObject("Server_DH_Params", "RESPONSE")

        if (response._ != "server_DH_params_fail" && response._ != "server_DH_params_ok") {
            throw new Error("[MT] Server_DH_Params response invalid: " + response._)
            return false
        }

        if (!bytesCmp(auth.nonce, response.nonce)) {
            throw new Error("[MT] Server_DH_Params nonce mismatch")
            return false
        }

        if (!bytesCmp(auth.serverNonce, response.server_nonce)) {
            throw new Error("[MT] Server_DH_Params server_nonce mismatch")
            return false
        }

        if (response._ == "server_DH_params_fail") {
            const newNonceHash = sha1BytesSync(auth.newNonce).slice(-16)
            if (!bytesCmp(newNonceHash, response.new_nonce_hash)) {
                throw new Error("[MT] server_DH_params_fail new_nonce_hash mismatch")
                return false
            }
            throw new Error("[MT] server_DH_params_fail")
            return false
        }

        try {
            mtpDecryptServerDhDataAnswer(auth, response.encrypted_answer)
        } catch (e) {
            throw e
            return false
        }

        mtpSendSetClientDhParams(auth)
    }, function (error) {
        throw error
    })
}

function mtpDecryptServerDhDataAnswer(auth, encryptedAnswer) {
    auth.localTime = tsNow()

    auth.tmpAesKey = sha1BytesSync(auth.newNonce.concat(auth.serverNonce)).concat(sha1BytesSync(auth.serverNonce.concat(auth.newNonce)).slice(0, 12))
    auth.tmpAesIv = sha1BytesSync(auth.serverNonce.concat(auth.newNonce)).slice(12).concat(sha1BytesSync([].concat(auth.newNonce, auth.newNonce)), auth.newNonce.slice(0, 4))

    var answerWithHash = aesDecryptSync(encryptedAnswer, auth.tmpAesKey, auth.tmpAesIv)

    var hash = answerWithHash.slice(0, 20)
    var answerWithPadding = answerWithHash.slice(20)
    var buffer = bytesToArrayBuffer(answerWithPadding)

    var deserializer = new TLDeserialization(buffer, {mtproto: true})
    var response = deserializer.fetchObject("Server_DH_inner_data")

    if (response._ != "server_DH_inner_data") {
        throw new Error("[MT] server_DH_inner_data response invalid: " + constructor)
    }

    if (!bytesCmp(auth.nonce, response.nonce)) {
        throw new Error("[MT] server_DH_inner_data nonce mismatch")
    }

    if (!bytesCmp(auth.serverNonce, response.server_nonce)) {
        throw new Error("[MT] server_DH_inner_data serverNonce mismatch")
    }

    console.log(dT(), "Done decrypting answer")
    auth.g = response.g
    auth.dhPrime = response.dh_prime
    auth.gA = response.g_a
    auth.serverTime = response.server_time
    auth.retry = 0

    mtpVerifyDhParams(auth.g, auth.dhPrime, auth.gA)

    const offset = deserializer.getOffset()

    if (!bytesCmp(hash, sha1BytesSync(answerWithPadding.slice(0, offset)))) {
        throw new Error("[MT] server_DH_inner_data SHA1-hash mismatch")
    }

    TimeManager.applyServerTime(auth.serverTime, auth.localTime)
}

function dT() {
    return new Date().getTime()
}

function mtpVerifyDhParams(g, dhPrime, gA) {
    console.log("Verifying DH params")
    var dhPrimeHex = bytesToHex(dhPrime)
    if (g != 3 ||
        dhPrimeHex !== "c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b") {
        // The verified value is from https://core.telegram.org/mtproto/security_guidelines
        throw new Error("[MT] DH params are not verified: unknown dhPrime")
    }
    console.log("dhPrime cmp OK")

    var gABigInt = new BigInteger(bytesToHex(gA), 16)
    var dhPrimeBigInt = new BigInteger(dhPrimeHex, 16)

    if (gABigInt.compareTo(BigInteger.ONE) <= 0) {
        throw new Error("[MT] DH params are not verified: gA <= 1")
    }

    if (gABigInt.compareTo(dhPrimeBigInt.subtract(BigInteger.ONE)) >= 0) {
        throw new Error("[MT] DH params are not verified: gA >= dhPrime - 1")
    }
    console.log(dT(), "1 < gA < dhPrime-1 OK")


    var two = new BigInteger(null)
    two.fromInt(2)
    var twoPow = two.pow(2048 - 64)

    if (gABigInt.compareTo(twoPow) < 0) {
        throw new Error("[MT] DH params are not verified: gA < 2^{2048-64}")
    }
    if (gABigInt.compareTo(dhPrimeBigInt.subtract(twoPow)) >= 0) {
        throw new Error("[MT] DH params are not verified: gA > dhPrime - 2^{2048-64}")
    }
    console.log(dT(), "2^{2048-64} < gA < dhPrime-2^{2048-64} OK")

    return true
}

function mtpSendSetClientDhParams(auth) {
    var deferred = auth.deferred
    var gBytes = bytesFromHex(auth.g.toString(16))

    auth.b = new Array(256)
    secureRandom().nextBytes(auth.b)

    const gB = modPow(gBytes, auth.b, auth.dhPrime)

    var data = new TLSerialization({mtproto: true})
    data.storeObject({
        _: "client_DH_inner_data",
        nonce: auth.nonce,
        server_nonce: auth.serverNonce,
        retry_id: [0, auth.retry++],
        g_b: gB
    }, "Client_DH_Inner_Data")

    var dataWithHash = createSHAHash(data.getBuffer()).concat(data.getBytes())

    var encryptedData = aesEncrypt(dataWithHash, auth.tmpAesKey, auth.tmpAesIv)

    var request = new TLSerialization({mtproto: true})
    request.storeMethod("set_client_DH_params", {
        nonce: auth.nonce,
        server_nonce: auth.serverNonce,
        encrypted_data: encryptedData
    })

    console.log(dT(), "Send set_client_DH_params")

    mtpSendPlainRequest(auth.dcID, request.getBuffer()).then(function ({deserializer}) {
        var response = deserializer.fetchObject("Set_client_DH_params_answer")

        if (response._ != "dh_gen_ok" && response._ != "dh_gen_retry" && response._ != "dh_gen_fail") {
            deferred.reject(new Error("[MT] Set_client_DH_params_answer response invalid: " + response._))
            return false
        }

        if (!bytesCmp(auth.nonce, response.nonce)) {
            deferred.reject(new Error("[MT] Set_client_DH_params_answer nonce mismatch"))
            return false
        }

        if (!bytesCmp(auth.serverNonce, response.server_nonce)) {
            deferred.reject(new Error("[MT] Set_client_DH_params_answer server_nonce mismatch"))
            return false
        }

        CryptoWorker.modPow(auth.gA, auth.b, auth.dhPrime).then(function (authKey) {
            var authKeyHash = sha1BytesSync(authKey),
                authKeyAux = authKeyHash.slice(0, 8),
                authKeyID = authKeyHash.slice(-8)

            console.log(dT(), "Got Set_client_DH_params_answer", response._)
            switch (response._) {
                case "dh_gen_ok":
                    var newNonceHash1 = sha1BytesSync(auth.newNonce.concat([1], authKeyAux)).slice(-16)

                    if (!bytesCmp(newNonceHash1, response.new_nonce_hash1)) {
                        deferred.reject(new Error("[MT] Set_client_DH_params_answer new_nonce_hash1 mismatch"))
                        return false
                    }

                    var serverSalt = bytesXor(auth.newNonce.slice(0, 8), auth.serverNonce.slice(0, 8))
                    // console.log("Auth successfull!", authKeyID, authKey, serverSalt)

                    auth.authKeyID = authKeyID
                    auth.authKey = authKey
                    auth.serverSalt = serverSalt

                    deferred.resolve(auth)
                    break

                case "dh_gen_retry":
                    var newNonceHash2 = sha1BytesSync(auth.newNonce.concat([2], authKeyAux)).slice(-16)
                    if (!bytesCmp(newNonceHash2, response.new_nonce_hash2)) {
                        deferred.reject(new Error("[MT] Set_client_DH_params_answer new_nonce_hash2 mismatch"))
                        return false
                    }

                    return mtpSendSetClientDhParams(auth)

                case "dh_gen_fail":
                    var newNonceHash3 = sha1BytesSync(auth.newNonce.concat([3], authKeyAux)).slice(-16)
                    if (!bytesCmp(newNonceHash3, response.new_nonce_hash3)) {
                        deferred.reject(new Error("[MT] Set_client_DH_params_answer new_nonce_hash3 mismatch"))
                        return false
                    }

                    deferred.reject(new Error("[MT] Set_client_DH_params_answer fail"))
                    return false
            }
        }, function (error) {
            deferred.reject(error)
        })
    }, function (error) {
        deferred.reject(error)
    })
}

mtpSendReqPQ(auth)
//
// console.log(messageSerializer.getBytes().length)
//
//
// const req = {
//     auth_key_id: 0x00000000,
//     message_id: messageId,
//     message_data_length: messageSerializer.getBytes(true).length,
//     message_data: messageSerializer.getBytes(true)
// }
//
// console.log(req)

// const serializer = new TLSerialization()
//
// serializer.storeMethod("users.getUsers", {
//     id: [
//         {
//             _: "inputUser",
//             user_id: 2
//         },
//         {
//             _: "inputUser",
//             user_id: 3
//         },
//         {
//             _: "inputUser",
//             user_id: 4
//         },
//     ]
// })
//
// console.log(serializer.getBytes(true))