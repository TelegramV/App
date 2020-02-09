import {ApiNetworker} from "./ApiNetworker";

export class FileNetworker extends ApiNetworker {
    constructor(authContext) {
        super(authContext)
    }

    onDisconnect() {
        console.error(`File networker died, respawning...`)
    }

    initPings() {

    }
}