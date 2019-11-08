import {bufferConcat, bytesFromArrayBuffer, bytesFromWords, bytesToHex, bytesToWords, createNonce} from "../utils/bin";
import {createLogger} from "../../common/logger";
import {aesEncryptSync} from "../crypto/aes";
import CryptoJS from "../vendor/crypto";

const Logger = createLogger("ObfuscatedWebSocket")

// https://core.telegram.org/mtproto/mtproto-transports#transport-obfuscation
export class ObfuscatedWebSocket {
    constructor(url) {
        this.url = url
        this.messageHandler = function() { }
    }

    open() {
        const self = this
        return new Promise(function (resolve) {
            self.socket = new WebSocket(self.url, "binary")
            self.socket.onopen = l => {
                self.onOpen.bind(self)()
                resolve()
            }
            self.socket.onmessage = self.onMessage.bind(self)
            self.socket.onclose = self.onClose.bind(self)
            self.socket.onerror = self.onError.bind(self)
        })
    }

    sendRaw(data) {
        Logger.info("sending data", bytesToHex(data))
        this.socket.send(data)
    }

    send(data) {
        this.sendRaw(new Uint8Array(this.encrypt(this.pad(data))))
    }

    // https://core.telegram.org/mtproto/mtproto-transports#padded-intermediate
    pad(data) {
        // > Padding: A random padding string of length 0-15
        const padding = 0
        // Directed by Robert B. Weide
        let d = new Uint8Array(data)
        let arr = new ArrayBuffer(d.byteLength + 4)
        let byteView = new Uint8Array(arr)
        byteView.set(d, 4)
        let intView = new Uint32Array(arr)

        intView[0] = d.length

        console.log(bytesToHex(new Uint8Array(data)))
        console.log(bytesToHex(byteView))

        return bytesFromArrayBuffer(arr)
    }

    encrypt(data) {
        // TODO check speed of crypto
        return bytesFromWords(CryptoJS.AES.encrypt(bytesToWords(data), this.encryptionKey, this.encryptSettings).ciphertext)
    }

    decrypt(data) {
        return bytesFromWords(CryptoJS.AES.decrypt({ciphertext: bytesToWords(data)}, this.decryptionKey, this.decryptSettings))
    }

    onOpen() {
        let randomBytes = new Uint8Array(createNonce(56))
        let slice = randomBytes.slice(0, 4)
        let slice2 = randomBytes.slice(4, 8)

        while(slice === new Uint8Array([0xdd, 0xdd, 0xdd, 0xdd]) || slice === new Uint8Array([0xee, 0xee, 0xee, 0xee])
        || slice2 === new Uint8Array([0x00, 0x00, 0x00, 0x00])) { // TODO check for other values
            randomBytes = new Uint8Array(createNonce(64))
            slice = randomBytes.slice(0, 4)
            slice2 = randomBytes.slice(4, 8)
        }

        randomBytes = bytesFromArrayBuffer(bufferConcat(bufferConcat(randomBytes, [0xee, 0xee, 0xee, 0xee]), createNonce(4)))

        const randomBytesReversed = randomBytes.slice().reverse()

        this.encryptionKey = bytesToWords(randomBytes.slice(8, 40))
        this.encryptionIV = bytesToWords(randomBytes.slice(40, 56))
        this.decryptionKey = bytesToWords(randomBytesReversed.slice(8, 40))
        this.decryptionIV = bytesToWords(randomBytesReversed.slice(40, 56))
        console.log("encrypt key", bytesToHex(randomBytes.slice(8, 40)), "iv", bytesToHex(randomBytes.slice(40, 56)))
        console.log(bytesToHex(randomBytes))

        this.encryptSettings = {
            iv: this.encryptionIV,
            padding: CryptoJS.pad.NoPadding,
            mode: CryptoJS.mode.CTR
        }
        this.decryptSettings = {
            iv: this.decryptionIV,
            padding: CryptoJS.pad.NoPadding,
            mode: CryptoJS.mode.CTR
        }
        const encryptedData = this.encrypt(randomBytes)
        console.log("encrypted", bytesToHex(encryptedData))

        const data = bufferConcat(randomBytes.slice(0, 56), encryptedData.slice(56, 56 + 8))
        this.sendRaw(data)
        Logger.info("Connection opened")
        //this.send([0xdd, 0xdd, 0xdd, 0xdd])
    }

    onMessage(event) {
        Logger.info("Got message: " + event.data)

        const decrypted = this.decrypt(event.data)
        this.messageHandler(decrypted)
    }

    onClose(event) {
        Logger.info(`Connection closed`, event)
    }

    onError(event) {
        Logger.info(`Connection error!`, event)
    }
}