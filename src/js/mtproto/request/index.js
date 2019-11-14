import TimeManager from "../timeManager"
import DataCenter from "../dataCenter"
import {TLSerialization} from "../language/serialization"
import {TLDeserialization} from "../language/deserialization"
import {mt_ws_set_processor, mt_ws_transport} from "../network/mt_ws_transport"
import {createLogger} from "../../common/logger"
import {bytesToHex} from "../utils/bin"

const Logger = createLogger("SendPlainRequest")

export function sendPlainRequest(dcID, requestBuffer, processor) {
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

    const url = DataCenter.chooseServer(dcID)

    mt_ws_set_processor(function (data_buffer) {
        if (data_buffer.byteLength <= 4) {
            console.error(data_buffer)
            throw new Error("404??")
        }

        const deserializer = new TLDeserialization(data_buffer, {mtproto: true})
        deserializer.fetchLong("auth_key_id")
        deserializer.fetchLong("msg_id")
        deserializer.fetchInt("msg_len")

        processor(deserializer);
    }, this);

    mt_ws_transport(url, resultBuffer);
}
