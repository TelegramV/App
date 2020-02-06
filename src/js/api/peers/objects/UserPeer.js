import {tsNow} from "../../../mtproto/timeManager";
import {getLastSeenMessage} from "../../dataObjects/utils";
import {Peer} from "./Peer";

export class UserPeer extends Peer {
    get name() {
        if (this.isDeleted) {
            return "Deleted Account"
        }

        return this.firstName + (this.lastName.length > 0 ? " " + this.lastName : "")
    }

    get firstName() {
        return this.raw.first_name || ""
    }

    get lastName() {
        return this.raw.last_name || ""
    }

    /**
     * @return {*|string|T|boolean}
     */
    get phone() {
        return this.raw.phone
    }

    get statusString() {
        let status = ""
        let online = false
        if (this.id === 777000) {
            status = "service notifications"
        } else {
            status = this.onlineStatus.online ? "online" : "last seen " + this.onlineStatus.status
            online = this.onlineStatus.online
        }
        return {
            text: status,
            online: online
        }
    }

    get onlineStatus() {
        if (this.isDeleted || !this.raw.status) {
            return {
                online: false,
                status: "a long time ago"
            }
        }

        const now = tsNow(true)

        switch (this.raw.status._) {
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
                    status: getLastSeenMessage(this.raw.status.was_online, now)
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