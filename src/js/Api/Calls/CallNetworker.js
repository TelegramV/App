import {BufferReader, BufferWriter} from "../../Utils/buffer";
import {convertToByteArray, createRandomBuffer} from "../../MTProto/utils/bin";
import AppConfiguration from "../../Config/AppConfiguration";
import TELEGRAM_CRYPTO from "../../MTProto/crypto/TELEGRAM_CRYPTO";
import {bytesAsHex} from "../../Utils/byte";
import OpusToPCM from "opus-to-pcm";
import {PCMPlayer} from "../../Utils/PCMPlayer";
import CallMessageHandler from "./CallMessageHandler";

export default class CallNetworker {
    constructor(connections, authKey, isOutgoing) {
        this.connections = connections
        this.isOutgoing = isOutgoing
        this.authKey = authKey
        this.messageHandler = new CallMessageHandler(this)
    }

    get peerTag() {
        return this.mainConnection.peer_tag
    }

    get socket() {
        return this.mainConnection.socket
    }

    sendPing(connection) {
        const buf = new BufferWriter()
        buf.storeBytes(connection.peer_tag)
        buf.storeInt(-1)
        buf.storeInt(-1)
        buf.storeInt(-1)
        buf.storeInt(-2)
        const rand = createRandomBuffer(8)
        buf.storeBytes(rand)

        connection.socket.send(buf.getBytes(true))
    }

    start() {
        return new Promise((resolve, reject) => {
            let first = true
            this.connections.forEach(connection => {
                // TODO configurable ip and port
                connection.socket = new WebSocket(`ws://127.0.0.1:1488`)
                connection.socket.binaryType = "arraybuffer"

                connection.socket.onopen = _ => {
                    const buf = new BufferWriter()
                    const enc = new Uint8Array(connection.ip.split(".").map(l => {
                        return parseInt(l)
                    }))
                    buf.storeBytes(enc)
                    buf.storeUshort(connection.port)
                    connection.socket.send(buf.getBytes(true))

                    connection.seq = 0
                    this.sendPing(connection)

                    if(first) {
                        first = false
                        this.mainConnection = connection
                        resolve(connection.socket)
                    }
                }
                connection.socket.onmessage = _ => {
                    this.parseMessage(_.data)
                }

                connection.socket.onclose = _ => {
                    console.error("onclose", _)
                }

                connection.socket.onerror = _ => {
                    console.error("onerror", _)
                }
            })
        })
    }

    init() {
        const buf = new BufferWriter()
        buf.storeInt(AppConfiguration.calls.protocolVersion)
        buf.storeInt(AppConfiguration.calls.minProtocolVersion)
        buf.storeInt(0) // flags

        buf.storeByte(1)
        buf.storeInt(1330664787)
        buf.storeByte(0)
        buf.storeByte(0)

        this.sendPacket(1, buf.getBytes())
    }

    writePacketHeader(buf, id, packet) {
        buf.storeByte(id)
        buf.storeInt(0) // last remote seq
        buf.storeInt(this.mainConnection.seq++) // seq
        buf.storeInt(0) // acks
        buf.storeByte(0) // flags

    }

    wrapPacket(id, packet) {
        const buf = new BufferWriter()
        this.writePacketHeader(buf, id, packet)
        buf.storeBytes(packet)

        return buf.getBytes()
    }

    encryptPacket(id, packet) {
        const buf = new BufferWriter()

        const wrapped = this.wrapPacket(id, packet)
        buf.storeShort(wrapped.length)
        buf.storeBytes(wrapped)

        let padLen = 16 - (2 + wrapped.length) % 16
        if(padLen < 16)
            padLen += 16;
        const padding = createRandomBuffer(padLen)
        buf.storeBytes(padding)
        const arr = buf.getBytes()

        const x = this.isOutgoing ? 0 : 8

        const encrypted = TELEGRAM_CRYPTO.encrypt_message(new Uint8Array(arr), this.authKey, x)

        const lastBuf = new BufferWriter()
        lastBuf.storeBytes(encrypted.msg_key)
        lastBuf.storeBytes(encrypted.bytes)

        return lastBuf.getBytes()
    }

    sendPacket(id, packet) {
        const wrapped = this.encryptPacket(id, packet)
        const buf = new BufferWriter()
        buf.storeBytes(this.peerTag)
        buf.storeBytes(wrapped)

        this.socket.send(new Uint8Array(buf.getBytes()))
    }

    parseMessage(data: ArrayBuffer) {
        data = new Uint8Array(data.slice(16, data.byteLength)) // skip peer_tag

        const buf = new BufferReader(data.buffer)

        let isRelayRequest = true
        for(let i = 0; i < 12; i++) {
            if(data[i] !== 0xff) {
                isRelayRequest = false
                break
            }
        }
        if(isRelayRequest) {
            buf.getBytes(12)
            const tlid = buf.getBytes(4)
            // console.log(tlid)

            // console.log("< " + bytesAsHex(convertToByteArray(data)))

            console.log("relay request", bytesAsHex(convertToByteArray(tlid)))
            if(tlid === 0xc01572c7) {

            }
            return
        }

        // if(data.byteLength - 16 < 40) {
        //     throw new Error("Received packet is too small: " + bytesAsHex(convertToByteArray(data)))
        // }
        const msgKey = buf.getBytes(16)
        const d = buf.getBytes(data.byteLength - 16)
        const decrypted = TELEGRAM_CRYPTO.decrypt_message(d, this.authKey, msgKey, this.isOutgoing ? 8 : 0).bytes
        if(decrypted.byteLength === 0) {
            throw new Error("Failed to decrypt packet")
        }

        this.parseDecryptedPacket(decrypted)
    }

    parseDecryptedPacket(packet) {
        const buf = new BufferReader(packet.buffer)
        const length = buf.getShort()

        const type = buf.getByte()
        const ackId = buf.getInt()
        const pseq = buf.getInt()
        const acks = buf.getInt()
        const flags = buf.getByte()

        const body = buf.getBytes(length - 14)
        buf.offset -= length - 14

        const handler = this.messageHandler.packetHandlers[type]
        if(!handler) {
            throw new Error("No message handler for type " + type + ", " + bytesAsHex(convertToByteArray(body)))
        }

        handler(buf, pseq)

        // console.log(`< type=${type}, ackId=${ackId}, pseq=${pseq}, acks=${acks}, flags=${flags}, body=`, bytesAsHex(convertToByteArray(body)))
    }

    sendStreamData(streamData) {

    }

    close() {
        this.connections.forEach(l => {
            l.socket.close(3000, "phoneCallDiscarded")
        })
    }

}