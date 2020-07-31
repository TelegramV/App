import { Peer } from "./Peer";
import { GroupPeer } from "./GroupPeer"
import MTProto from "../../../MTProto/External"


// @deprecated
function getLastSeenMessage(timestamp, now) {
    const diff = Math.abs(now - timestamp)

    if (diff < 60) {
        return "just now"
    }

    if (diff < 3600) {
        const minutes = Math.floor(diff / 60);

        if (minutes === 1) {
            return "1 minute ago"
        }

        return `${minutes} minutes ago`
    }

    if (diff < 86400) {
        const hours = Math.floor(diff / 3600);

        if (hours === 1) {
            return "1 hour ago"
        }

        return `${hours} hours ago`
    }

    const days = Math.floor(diff / 86400)

    if (days === 1) {
        return "1 day ago"
    }

    return `${days} days ago`
}

function getLastSeenKey(timestamp, now) {
    const diff = Math.abs(now - timestamp)

    if (diff < 60) {
        return {
            key: "lng_status_lastseen_now"
        }
    }

    if (diff < 3600) {
        const minutes = Math.floor(diff / 60);

        return {
            key: "lng_status_lastseen_minutes",
            count: minutes,
            replaces: {
                count: minutes
            }
        }
    }

    if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return {
            key: "lng_status_lastseen_hours",
            count: hours,
            replaces: {
                count: hours
            }
        }
    }

    let date = new Date(timestamp).toLocaleDateString("en", {year: "2-digit", month: "2-digit", day: "2-digit"});
    return {
        key: "lng_status_lastseen_date",
        replaces: {
            date: date
        }
    }

}

export class UserPeer extends Peer {

    participateIn: Set < GroupPeer > = new Set()

    get firstName() {
        return this.raw.first_name || ""
    }

    get lastName() {
        return this.raw.last_name || ""
    }

    get name() {
        if (this.isDeleted) {
            return "Deleted Account"
        }

        return this.firstName + (this.lastName.length > 0 ? " " + this.lastName : "")
    }

    /**
     * @return {*|string|T|boolean}
     */
    get phone() {
        return this.raw.phone
    }

    get isContact(): boolean {
        return !!this.raw.contact
    }

    set status(status) {
        this.raw.status = status
        this.fire("updateUserStatus")
        this.participateIn.forEach(groupPeer => groupPeer.refreshOnlineCount())
    }

    /*
     * @deprecated
     */
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

    /*
     * @deprecated
     */
    get onlineStatus() {
        if (this.isDeleted || !this.raw.status) {
            return {
                online: false,
                status: "a long time ago"
            }
        }

        const now = MTProto.TimeManager.now(true)

        switch (this.raw.status._) {
            case "userStatusOnline":

                return {
                    online: this.raw.status.expires > now,
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

    get status() {
        let status = ""
        let online = false
        if (this.id === 777000) {
            return {
                key: "lng_status_service_notifications"
            }
        } else {
            if (this.isDeleted || !this.raw.status) {
                return {
                    key: "lng_status_offline"
                }
            }
            const now = MTProto.TimeManager.now(true)

            switch (this.raw.status._) {
                case "userStatusOnline":
                    if (this.raw.status.expires > now) {
                        return {
                            key: "lng_status_online"
                        }
                    } else {
                        return {
                            key: "lng_status_offline"
                        }
                    }

                case "userStatusLastWeek":
                    return {
                        key: "lng_status_last_week"
                    }
                case "userStatusRecently":
                    return {
                        key: "lng_status_recently"
                    }
                case "userStatusLastMonth":
                    return {
                        key: "lng_status_last_month"
                    }
                case "userStatusOffline":
                    return getLastSeenKey(this.raw.status.was_online, now)
                case "userStatusEmpty":
                    return {
                        key: "lng_status_offline"
                    }
            }
        }
    }

    get isBot() {
        return false
    }
}