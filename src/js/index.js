import MTProto from "./mtproto"
import {bufferConcat, bytesFromHex, bytesToHex, createNonce, nextRandomInt} from "./mtproto/utils/bin"
import {createLogger} from "./common/logger";
import {sha1BytesSync, sha256HashSync} from "./mtproto/crypto/sha";
import {aesEncryptSync} from "./mtproto/crypto/aes";
import {TLSerialization} from "./mtproto/language/serialization";
import DataCenter from "./mtproto/dataCenter";
import axios from "axios";
import {TLDeserialization} from "./mtproto/language/deserialization";
import {MtpTimeManager} from "./mtproto/timeManager";
import {Networker} from "./mtproto/network";

const Logger = createLogger("main")

window.mtprotoStorage = {}

const config = {
    id: 196813,
    hash: "43480cc21fbf059d3037140217683aaa",
    layer: 107,
    version: "1.0.1"
}

const auth = {
    dcID: 0,
    nonce: createNonce(16),
    sessionID: createNonce(8) // TODO check if secure?
}



function start() {
    let networker = new Networker(auth)
    Logger.log(auth)

    networker.sendMessage(networker.wrapApiCall("help.getNearestDc", {}, {mtproto: false, schema: require("./mtproto/language/schema_api")}));
    networker.sendMessage(networker.wrapApiCall("auth.sendCode", {
        flags: 0,
        phone_number: "+9996601488",
        api_id: 1147988,
        api_hash: "4acddf30a6113bfe220f7fd67ab7f468",
        settings: {
            _: "codeSettings",
            flags: 0,
            pFlags: {
                current_number: false,
                allow_app_hash: false,
                allow_flashcall: false
            }
        },
        lang_code: navigator.language || 'en'
    }, {mtproto: false, schema: require("./mtproto/language/schema_api")}));

}

// TODO replace with valid storage checks
if (!window.localStorage.getItem("authKey")) {
    MTProto.connect(auth).then(l => {
        Logger.warn(auth)
        Logger.log(auth.authKey)
        window.localStorage.setItem("authKey", bytesToHex(new Uint8Array(auth.authKey)))
        window.localStorage.setItem("serverSalt", bytesToHex(auth.serverSalt))
    }).then(start)
} else {
    auth.authKey = new Uint8Array(bytesFromHex(window.localStorage.getItem("authKey")))
    auth.serverSalt = bytesFromHex(window.localStorage.getItem("serverSalt"))
    start()
}
