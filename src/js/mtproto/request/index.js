import axios from "axios"
import TimeManager from "../timeManager"
import DataCenter from "../dataCenter"
import {TLSerialization} from "../language/serialization"
import {TLDeserialization} from "../language/deserialization"

delete axios.defaults.headers.post["Content-Type"]
delete axios.defaults.headers.common["Accept"]

export function sendPlainRequest(dcID, requestBuffer) {
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