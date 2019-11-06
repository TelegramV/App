import MTProto from "./mtproto"
import {createNonce} from "./mtproto/utils/bin"


const config = {
    id: 196813,
    hash: "43480cc21fbf059d3037140217683aaa",
    layer: 107,
    version: "1.0.1"
}

const auth = {
    dcID: 0,
    nonce: createNonce(16)
}

MTProto.connect(auth)