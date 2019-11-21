import {Dialog} from "./dialog";
import {tsNow} from "../mtproto/timeManager";
import {getLastSeenMessage} from "./utils";

export class UserDialog extends Dialog {
    get peerName() {
        return this.firstName + " " + this.lastName
    }
    get firstName() {
        return this.peer.first_name
    }
    get lastName() {
        return this.peer.last_name || ""
    }

    get onlineStatus() {
        const now = tsNow(true)
        switch (this._peer.status._) {
            case "userStatusOnline":
                if(this._peer.status.expires < now)
                    return {
                        online: true
                    }
                return {
                    online: false,
                    status: getLastSeenMessage(this._peer.status.expires, now)
                }
            case "userStatusLastWeek":
                return {
                    online: false,
                    status: "a week ago"
                }
            case "userStatusRecently":
                return {
                    online: false,
                    status: "recently"
                }
            case "userStatusLastMonth":
                return {
                    online: false,
                    status: "last month"
                }
            case "userStatusOffline":
                return {
                    online: false,
                    status: getLastSeenMessage(this._peer.status.was_online, now)
                }
            default:
            case "userStatusEmpty":
                return {
                    online: false,
                    status: "a long time ago"
                }
        }
    }
}