import {UserPeer} from "./UserPeer";

export class BotPeer extends UserPeer {
    get onlineStatus() {
        return {
            online: false,
            status: "bot"
        }
    }
}