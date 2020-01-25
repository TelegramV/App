import {Networker} from "./networker";
import {TLSerialization} from "../language/serialization";
import {TLDeserialization} from "../language/deserialization";
import {createLogger} from "../../common/logger";
import {ApiNetworker} from "./apiNetworker";
import MTProto from "../index";

const Logger = createLogger("FileNetworker")

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
