import {ApiNetworker} from "./ApiNetworker";

export class OneTimeNetworker extends ApiNetworker {

    constructor(authContext, mtproto = false) {
        authContext.updates = false
        super(authContext, mtproto)
    }

    onDisconnect() {

        this.auth = undefined
        this.messageProcessor = undefined

        this.socket.inob_clear()

        this.socket.transportationInit = undefined
        this.socket.transportationEstablishing = undefined
        this.socket.transportationQueue = undefined
        this.socket.transportationQueueLen = undefined

        this.socket.aes_encryptor = undefined
        this.socket.aes_decryptor = undefined
        this.socket.obfuscation_init = undefined

        console.warn("one time networker died")
    }

    onConnect() {
        this.connected = true
        console.log("one time networker is available")
    }

    invokeMethod(method, params, options = {}): Promise<any> {
        return super.invokeMethod(method, params, options).then(() => {
            this.socket.transportationSocket.close(-1, "request done")
        })
    }

    checkConnection() {

    }

    initPings() {

    }
}