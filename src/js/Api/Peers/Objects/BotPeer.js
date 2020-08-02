import {UserPeer} from "./UserPeer";

export class BotPeer extends UserPeer {
    get onlineStatus() {
        return {
            online: false,
            status: "bot"
        }
    }

    // @deprecated
    get statusString() {
        return {
            text: "bot",
            online: false
        }
    }

    get status() {
        return {
            key: "lng_status_bot"
        }
    }

    get isBot() {
        return true
    }
}