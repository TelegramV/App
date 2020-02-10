import {mt_get_random_num_secure, mt_write_bytes, mt_write_uint32} from "./mt_inob_codec"
import aesjs from "../utils/aes"

export class MTSocket {
    constructor(props) {
        this.networker = props.networker

        this.transportationSocket = new WebSocket(this.networker.dcUrl, "binary")
        this.transportationSocket.binaryType = "arraybuffer"

        this.transportationInit = false
        this.transportationEstablishing = false
        this.transportationQueue = []
        this.transportationQueueLen = 0

        this.aes_encryptor = undefined
        this.aes_decryptor = undefined
        this.obfuscation_init = undefined
    }

    refreshSocket() {
        console.log("refreshing socket..")
        this.inob_clear()
        this.transportationSocket = new WebSocket(this.networker.dcUrl, "binary")
        this.transportationSocket.binaryType = "arraybuffer"
        this.transportationInit = false
        this.transportationEstablishing = false

        // may be bugs
        this.transportationQueue = []
        this.transportationQueueLen = 0
    }

    inob_clear() {
        this.obfuscation_init = undefined
        this.aes_decryptor = undefined
        this.aes_encryptor = undefined
    }


    transport(buffer) {
        if (!this.transportationInit) {
            if (!this.transportationEstablishing) {
                this.init_transportation()
                this.transportationQueue[this.transportationQueueLen] = buffer;
                ++(this.transportationQueueLen);
                this.transportationEstablishing = true;
            } else {
                this.transportationQueue[this.transportationQueueLen] = buffer;
                ++(this.transportationQueueLen);
            }
            return;
        }

        this.inob_send(buffer, buffer.byteLength);
    }

    init_transportation() {
        this.transportationSocket.onopen = (ev) => {
            for (let i = 0; i < this.transportationQueueLen; i++) {
                this.inob_send(this.transportationQueue[i], this.transportationQueue[i].byteLength)
            }

            this.onConnect()

            this.transportationInit = true
        }

        this.transportationSocket.onmessage = (ev) => {
            const data_buffer = this.inob_recv(ev)

            if (data_buffer.byteLength <= 4) {
                //some another protocol violation here
                throw new Error("404?? " + this.networker.auth.dcID)
            }

            this.networker.processResponse(data_buffer)
        }

        this.transportationSocket.onerror = (ev) => {
            console.error("SOCK_ERROR");
        }

        this.transportationSocket.onclose = (ev) => {
            console.log("SOCK_CLOSE")

            if (!(ev.wasClean)) {
                console.log("CRASHED")
            }

            console.log('code: ' + ev.code + ' reason: ' + ev.reason)

            this.onDisconnect()
        }
    }

    init_obfuscation(out_buffer_view) {
        let out_buffer_offset = 0

        const obfuscation_buffer = new ArrayBuffer(64)
        const obfuscation_buffer_view = new DataView(obfuscation_buffer)
        let obfuscation_buffer_offset = 0

        for (; ;) {
            const f = mt_get_random_num_secure(0xFFFFFFFF)
            const s = mt_get_random_num_secure(0xFFFFFFFF)

            if ((f & 0xFF) !== 0xef && f !== 0xdddddddd && f !== 0xeeeeeeee
                && f !== 0x504f5354 && f !== 0x474554 && f !== 0x48454144 && s !== 0x00000000) {
                mt_write_uint32(obfuscation_buffer_offset, f, obfuscation_buffer_view);
                obfuscation_buffer_offset += 4;
                mt_write_uint32(obfuscation_buffer_offset, s, obfuscation_buffer_view);
                obfuscation_buffer_offset += 4;
                break;
            }
        }

        for (let i = 0; i < 12; ++i) {
            mt_write_uint32(obfuscation_buffer_offset, mt_get_random_num_secure(0xFFFFFFFF), obfuscation_buffer_view);
            obfuscation_buffer_offset += 4;
        }

        mt_write_uint32(obfuscation_buffer_offset, 0xeeeeeeee, obfuscation_buffer_view);
        obfuscation_buffer_offset += 4;

        obfuscation_buffer_view.setUint8(obfuscation_buffer_offset, 0xfe);
        ++obfuscation_buffer_offset;
        obfuscation_buffer_view.setUint8(obfuscation_buffer_offset, 0xff);
        ++obfuscation_buffer_offset;

        obfuscation_buffer_view.setUint16(obfuscation_buffer_offset, mt_get_random_num_secure(0xFFFF));
        obfuscation_buffer_offset += 2;

        for (let i = 0; i < 56; ++i) {
            out_buffer_view.setUint8(out_buffer_offset, obfuscation_buffer_view.getUint8(i));
            ++out_buffer_offset;
        }

        const obf_key_256 = new Uint8Array(obfuscation_buffer.slice(8, 40))
        const obf_vector_128 = new Uint8Array(obfuscation_buffer.slice(40, 56))

        const obfuscation_buffer_u8arr = new Uint8Array(obfuscation_buffer)

        this.aes_encryptor = new aesjs.ModeOfOperation.ctr(obf_key_256, new aesjs.Counter(obf_vector_128));
        const encryptedBytes = this.aes_encryptor.encrypt(obfuscation_buffer_u8arr)

        for (let i = 56; i < 64; ++i) {
            out_buffer_view.setUint8(out_buffer_offset, encryptedBytes[i]);
            ++out_buffer_offset;
        }

        const obfuscation_buffer_reverse = obfuscation_buffer_u8arr.reverse()

        const deobf_key_256 = new Uint8Array(obfuscation_buffer_reverse.slice(8, 40))
        const deobf_vector_128 = new Uint8Array(obfuscation_buffer_reverse.slice(40, 56))

        this.aes_decryptor = new aesjs.ModeOfOperation.ctr(deobf_key_256, new aesjs.Counter(deobf_vector_128));
    }

    inob_send_init() {
        const obf_buffer = new ArrayBuffer(64)
        const obf_buffer_view = new DataView(obf_buffer)

        this.init_obfuscation(obf_buffer_view)
        this.transportationSocket.send(obf_buffer)

        this.obfuscation_init = true
    }

    inob_send(buffer, buffer_len) {
        if (!this.obfuscation_init) {
            this.inob_send_init()
        }

        const out_buffer = new ArrayBuffer(buffer_len + 4)
        const out_buffer_view = new DataView(out_buffer)

        //console.log(buffer_len);
        mt_write_uint32(0, buffer_len, out_buffer_view);
        mt_write_bytes(4, buffer_len, new Uint8Array(buffer), out_buffer_view);

        const encrypted_buffer = this.aes_encryptor.encrypt(new Uint8Array(out_buffer))
        this.transportationSocket.send(encrypted_buffer);
    }

    inob_recv(ev) {
        if (!this.obfuscation_init) {
            return null
        }

        const decrypted_buffer = (this.aes_decryptor.decrypt(new Uint8Array(ev.data))).buffer
        return (decrypted_buffer.slice(4));
    }

    onConnect() {
        this.networker.onConnect()
    }

    onDisconnect() {
        this.refreshSocket()
        this.networker.onDisconnect()
    }
}