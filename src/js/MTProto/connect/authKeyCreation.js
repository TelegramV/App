import Bytes from "../utils/bytes"
import {rsaKeyByFingerprints} from "./rsaKeys"
import {RSA_ENCRYPT} from "../crypto/rsa"
import {SHA1, SHA1_ArrayBuffer} from "../crypto/sha"
import {tsNow} from "../timeManager"
import {SecureRandomSingleton} from "../utils/singleton"
import VBigInt from "../bigint/VBigInt"
import PQ from "../utils/pq"
import {AES_IGE_DECRYPT, AES_IGE_ENCRYPT} from "../crypto/aes"
import TL from "../language/TL"
import {concat} from "../crypto/TELEGRAM_CRYPTO"

async function step1_req_pq_multi(networker) {
    const authContext = networker.auth

    console.debug("step1 authContext = ", authContext)

    const deserializer = await networker.invokeMethod("req_pq", {
        nonce: authContext.nonce
    })

    return deserializer.object("ResPQ")
}

function step2_handle_resPQ(resPQ, authContext) {
    // check if nonces are equal
    if (!Bytes.compare(resPQ.nonce, authContext.nonce)) {
        throw new Error("invalid nonce")
    }

    authContext.serverNonce = resPQ.server_nonce
    authContext.pq = resPQ.pq
    authContext.fingerprints = resPQ.server_public_key_fingerprints

    authContext.publicKey = rsaKeyByFingerprints(authContext.fingerprints)

    if (!authContext.publicKey) {
        throw new Error("No public key found.")
    }
}

function step3_decompose_pq(pq) {
    return Promise.resolve(PQ.decompose(pq))
}

async function step4_req_DH_params(pAndQ, networker) {
    const authContext = networker.auth

    console.debug("step4 authContext = ", authContext)

    authContext.newNonce = new Array(32)
    SecureRandomSingleton.nextBytes(authContext.newNonce)

    const data_serializer = TL.pack({
        _: "p_q_inner_data",
        pq: authContext.pq,
        p: authContext.p,
        q: authContext.q,
        nonce: authContext.nonce,
        server_nonce: authContext.serverNonce,
        new_nonce: authContext.newNonce
    }, "P_Q_inner_data")

    let dataWithHash = new Uint8Array(SHA1(data_serializer.toBuffer()))
    dataWithHash = concat(dataWithHash, data_serializer.toUint8Array())

    let encryptedData = RSA_ENCRYPT(authContext.publicKey, dataWithHash)

    const deserializer = await networker.invokeMethod("req_DH_params", {
        nonce: authContext.nonce,
        server_nonce: authContext.serverNonce,
        p: pAndQ.p,
        q: pAndQ.q,
        public_key_fingerprint: authContext.publicKey.fingerprint,
        encrypted_data: encryptedData
    })

    return deserializer.object("Server_DH_Params")
}

async function step5_Server_DH_Params(ServerDHParams, networker) {
    const authContext = networker.auth
    authContext.localTime = tsNow()

    console.debug("step5 authContext = ", authContext)

    if (ServerDHParams._ !== "server_DH_params_ok") {
        throw new Error(ServerDHParams._)
    }

    if (!Bytes.compare(authContext.nonce, ServerDHParams.nonce)) {
        throw new Error("Server_DH_Params invalid nonce")
    }

    if (!Bytes.compare(authContext.serverNonce, ServerDHParams.server_nonce)) {
        throw new Error("Server_DH_Params invalid server_nonce")
    }

    authContext.tmpAesKey = SHA1(concat(authContext.newNonce, authContext.serverNonce))
        .concat(SHA1(concat(authContext.serverNonce, authContext.newNonce))
            .slice(0, 12))

    authContext.tmpAesIv = SHA1(concat(authContext.serverNonce, authContext.newNonce))
        .slice(12)
        .concat(SHA1([].concat(authContext.newNonce, authContext.newNonce)), authContext.newNonce
            .slice(0, 4))


    const answer_with_hash = AES_IGE_DECRYPT(ServerDHParams.encrypted_answer, authContext.tmpAesKey, authContext.tmpAesIv)

    const hash = answer_with_hash.slice(0, 20)
    const answerWithPadding = answer_with_hash.slice(20)
    const answerWithPaddingBuffer = Bytes.asUint8Buffer(answerWithPadding)

    const deserializer = TL.unpacker(answerWithPaddingBuffer)
    const Server_DH_inner_data = deserializer.object("Server_DH_inner_data")

    if (Server_DH_inner_data._ !== "server_DH_inner_data") {
        throw new Error("server_DH_inner_data bad response: " + constructor)
    }

    if (!Bytes.compare(authContext.nonce, Server_DH_inner_data.nonce)) {
        throw new Error("server_DH_inner_data bad nonce")
    }

    if (!Bytes.compare(authContext.serverNonce, Server_DH_inner_data.server_nonce)) {
        throw new Error("server_DH_inner_data bad server_nonce")
    }


    authContext.g = Server_DH_inner_data.g
    authContext.dhPrime = Server_DH_inner_data.dh_prime
    authContext.gA = Server_DH_inner_data.g_a
    authContext.serverTime = Server_DH_inner_data.server_time
    authContext.retry = 0


    // the following code was stolen from (c) webogram
    const dhPrimeHex = Bytes.asHex(authContext.dhPrime)
    if (Number(authContext.g) !== 3 ||
        dhPrimeHex !== "c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b") {
        // The verified value is from https://core.telegram.org/mtproto/security_guidelines
        throw new Error("DH params are not verified: unknown dhPrime")
    }

    const gABigInt = VBigInt.create("0x" + Bytes.asHex(authContext.gA))
    const dhPrimeBigInt = VBigInt.create("0x" + dhPrimeHex)

    if (gABigInt.lessThanOrEqual(VBigInt.create(1))) {
        throw new Error("gA <= 1")
    }

    if (gABigInt.greaterThanOrEqual(dhPrimeBigInt.subtract(VBigInt.create(1)))) {
        throw new Error("gA >= dhPrime - 1")
    }

    const two = VBigInt.create(2)
    const twoPow = two.pow(VBigInt.create(2048 - 64))

    if (gABigInt.lessThan(twoPow)) {
        throw new Error("gA < 2^{2048-64}")
    }
    if (gABigInt.greaterThanOrEqual(dhPrimeBigInt.subtract(twoPow))) {
        throw new Error("gA > dhPrime - 2^{2048-64}")
    }

    const offset = deserializer.offset

    if (!Bytes.compare(hash, SHA1(answerWithPadding.slice(0, offset)))) {
        throw new Error("server_DH_inner_data SHA1-hash mismatch")
    }

    networker.timeManager.applyServerTime(authContext.dcID, authContext.serverTime, authContext.localTime)

    return true
}

async function step6_set_client_DH_params(networker, processor, proc_context) {
    const authContext = networker.auth
    console.debug("step6 authContext = ", authContext)

    const gBytes = Bytes.fromHex(authContext.g.toString(16))
    authContext.b = new Array(256)
    SecureRandomSingleton.nextBytes(authContext.b)
    const gB = Bytes.modPow(gBytes, authContext.b, authContext.dhPrime)

    const Client_DH_Inner_Data_serialization = TL.pack({
        _: "client_DH_inner_data",
        nonce: authContext.nonce,
        server_nonce: authContext.serverNonce,
        retry_id: new Uint8Array([0, authContext.retry++]),
        g_b: gB
    }, "Client_DH_Inner_Data")

    const dataWithHash = concat(new Uint8Array(SHA1(Client_DH_Inner_Data_serialization.toBuffer())), Client_DH_Inner_Data_serialization.toUint8Array())
    console.debug("SendSetClientDhParams", dataWithHash, authContext)

    const encryptedData = AES_IGE_ENCRYPT(dataWithHash, authContext.tmpAesKey, authContext.tmpAesIv)
    let Set_client_DH_params_answer_response = await networker.invokeMethod("set_client_DH_params", {
        nonce: authContext.nonce,
        server_nonce: authContext.serverNonce,
        encrypted_data: encryptedData
    })

    const Set_client_DH_params_answer = Set_client_DH_params_answer_response.object("Set_client_DH_params_answer")

    if (Set_client_DH_params_answer._ !== "dh_gen_ok" && Set_client_DH_params_answer._ !== "dh_gen_retry" && Set_client_DH_params_answer._ !== "dh_gen_fail") {
        throw new Error("Set_client_DH_params_answer bad response: " + Set_client_DH_params_answer._)
    }

    if (!Bytes.compare(authContext.nonce, Set_client_DH_params_answer.nonce)) {
        throw new Error("Set_client_DH_params_answer bad nonce")
    }

    if (!Bytes.compare(authContext.serverNonce, Set_client_DH_params_answer.server_nonce)) {
        throw new Error("Set_client_DH_params_answer bad server_nonce")
    }

    const authKey = Bytes.modPow(authContext.gA, authContext.b, authContext.dhPrime)

    console.debug("GOT auth key!", authKey)

    const authKeyHash = SHA1(authKey)
    const authKeyAux = authKeyHash.slice(0, 8)
    const authKeyID = authKeyHash.slice(-8)

    switch (Set_client_DH_params_answer._) {
        case "dh_gen_ok":
            const newNonceHash1 = Bytes.fromArrayBuffer(SHA1_ArrayBuffer(authContext.newNonce.concat([1], authKeyAux))).slice(-16)

            /**
             * FIXME: ...
             */
            if (!Bytes.compare(newNonceHash1, Set_client_DH_params_answer.new_nonce_hash1)) {
                throw new Error("Set_client_DH_params_answer new_nonce_hash1 mismatch")
            }

            const serverSalt = Bytes.xor(authContext.newNonce.slice(0, 8), authContext.serverNonce.slice(0, 8))

            authContext.authKeyID = authKeyID
            authContext.authKey = authKey
            authContext.serverSalt = serverSalt

            console.debug("GOT EVERYTHING! ", authContext)

            break

        case "dh_gen_retry":
            console.debug("RETRY!!!")
            const newNonceHash2 = SHA1(authContext.newNonce.concat([2], authKeyAux)).slice(-16)
            if (!Bytes.compare(newNonceHash2, Set_client_DH_params_answer.new_nonce_hash2)) {
                throw new Error("Set_client_DH_params_answer bad new_nonce_hash2")
            }

            // what the fuck?!
            return await step6_set_client_DH_params(authContext, function () {
                processor.call(proc_context)
            }, this)

        case "dh_gen_fail":
            const newNonceHash3 = SHA1(authContext.newNonce.concat([3], authKeyAux)).slice(-16)
            if (!Bytes.compare(newNonceHash3, Set_client_DH_params_answer.new_nonce_hash3)) {
                throw new Error("Set_client_DH_params_answer bad new_nonce_hash3")
            }

            throw new Error("Set_client_DH_params_answer fail")
    }
}

export default async function (networker) {
    const resPQ = await step1_req_pq_multi(networker)
    step2_handle_resPQ(resPQ, networker.auth)

    console.debug("pq decomposition started")
    const pAndQ = await step3_decompose_pq(resPQ.pq)
    networker.auth.p = pAndQ.p
    networker.auth.q = pAndQ.q
    console.debug("found pAndQ = ", pAndQ)

    const ServerDHParams = await step4_req_DH_params(pAndQ, networker)

    await step5_Server_DH_Params(ServerDHParams, networker)
    await step6_set_client_DH_params(networker)
}