import {UserPeer} from "./userPeer";

export class BotPeer extends UserPeer {
    get onlineStatus() {
        return {
            online: false,
            status: "bot"
        }
    }
}