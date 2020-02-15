/**
 * (c) Telegram V
 */

import {ApiNetworker} from "./ApiNetworker";

export class FileNetworker extends ApiNetworker {
    constructor(authContext, mtproto = false) {
        super(authContext, mtproto)
    }

    onDisconnect() {
        console.error(`File networker died, respawning...`)
    }

    initPings() {

    }
}