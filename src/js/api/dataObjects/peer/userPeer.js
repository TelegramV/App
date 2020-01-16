import {tsNow} from "../../../mtproto/timeManager";
import {getLastSeenMessage} from "../utils";
import {Peer} from "./peer";
import {createLogger} from "../../../common/logger";

const Logger = createLogger("UserPeer")

export class UserPeer extends Peer {
    get peerName() {
        if (this.isDeleted) {
            return "Deleted Account"
        }

        return this.firstName + (this.lastName.length > 0 ? " " + this.lastName : "")
    }

    get firstName() {
        return this.peer.first_name
    }

    get lastName() {
        return this.peer.last_name || ""
    }

    get onlineStatus() {
        if (this.isDeleted || !this.peer.status) {
            return {
                online: false,
                status: "a long time ago"
            }
        }

        const now = tsNow(true)

        switch (this.peer.status._) {
            case "userStatusOnline":

                return {
                    online: true
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
                    status: getLastSeenMessage(this.peer.status.was_online, now)
                }
            case "userStatusEmpty":
                return {
                    online: false,
                    status: "a long time ago"
                }

            default:
        }
    }
}