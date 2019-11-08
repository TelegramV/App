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
import {ObfuscatedWebSocket} from "./mtproto/network/websocket";

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
    let ws = new ObfuscatedWebSocket("ws://149.154.167.40:80/apiws_test")
    ws.open().then(_ => {
        let networker = new Networker(auth, ws)
        Logger.log(auth)
        ws.send(bytesFromHex("4b965d91d4899dad55fb78e0028fbf6bf2563704eed9dacdf3191f40ed20ae27347f4908284968e5935ba03c5ea5004f41a68ff5108b342fcedccef0b2b08159368538142d5ce521d35662ef53cc2b2a9ccc392352bb79daebfbc40116bfd8ac88226bba6db062ef9729ff25e8f36f6916d1415aa9f57c61153808128b8b21331ef8687edaeda347b0fd7d778fe9ee8d26acfac2493f88c7bbebd5afeaf65b036846ad176a519cec7018c293f60f860dccb2986c3600760b7d194a77f27e629933b5b8c13a45e964f4be68c2353e6c657912d1f5e3f929792203daf5c20871da15fec1463e7df74c84f2806c7e6c43e7bd1c8a42a104a65ca46ba7f6e147a916a54de6d915fc11d770b074f1b13901136cfae93501e0ed93fe82c6a7629131fe477c8fbc89e6bc633c05b08c3d524b2206f10b1e04e2376be4c02af3b1f54bcdc1d0752c62688cb1a4c5da5d20c0cce01f48e5792caf1f763628ce9eba1afaadc5660d7061582b11"))
        /*networker.sendMessage(networker.wrapApiCall("help.getNearestDc", {}, {
            mtproto: false,
            schema: require("./mtproto/language/schema_api")
        }));*/
        // networker.sendMessage(networker.wrapApiCall("auth.sendCode", {
        //     flags: 0,
        //     phone_number: "+380956031588",
        //     api_id: 1147988,
        //     api_hash: "4acddf30a6113bfe220f7fd67ab7f468",
        //     settings: {
        //         _: "codeSettings",
        //         flags: 0,
        //         pFlags: {
        //             current_number: false,
        //             allow_app_hash: false,
        //             allow_flashcall: false
        //         }
        //     },
        //     lang_code: navigator.language || 'en'
        // }, {mtproto: false, schema: require("./mtproto/language/schema_api")}));
    });
}

// TODO replace with valid storage checks
if (!window.localStorage.getItem("authKey")) {
    MTProto.connect(auth).then(l => {
        Logger.warn(auth)
        Logger.log(auth.authKey)
        auth.authKey = new Uint8Array(auth.authKey)
        auth.serverSalt = new Uint8Array(auth.serverSalt)
        window.localStorage.setItem("authKey", bytesToHex(auth.authKey))
        window.localStorage.setItem("serverSalt", bytesToHex(auth.serverSalt))
    }).then(start)
} else {
    auth.authKey = new Uint8Array(bytesFromHex(window.localStorage.getItem("authKey")))
    auth.serverSalt = bytesFromHex(window.localStorage.getItem("serverSalt"))
    start()
}
