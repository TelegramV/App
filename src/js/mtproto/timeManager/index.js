import Storage from "../../common/storage"
import {longFromInts, nextRandomInt} from "../utils/bin"
import {createLogger} from "../../common/logger"

const Logger = createLogger("MtpTimeManager")

export class MtpTimeManager {
    constructor() {
        this.lastMessageID = [0, 0]
        this.timeOffset = 0

        Storage.get("server_time_offset").then(function (offset) {
            if (offset) {
                this.timeOffset = offset
            }

            Logger.warn("offset = ", offset)
        })

        console.error("FUCK", this)
    }

    generateMessageID() {

        Logger.warn("generateMessageID this.timeOffset = ", this.timeOffset)

        const timeTicks = tsNow()
        const timeSec = Math.floor(timeTicks / 1000) + this.timeOffset
        const timeMSec = timeTicks % 1000
        const random = nextRandomInt(0xFFFF)

        let messageID = [timeSec, (timeMSec << 21) | (random << 3) | 4]

        if (this.lastMessageID[0] > messageID[0] || this.lastMessageID[0] == messageID[0] && this.lastMessageID[1] >= messageID[1]) {
            messageID = [this.lastMessageID[0], this.lastMessageID[1] + 4]
        }

        this.lastMessageID = messageID

        return longFromInts(messageID[0], messageID[1])
    }

    applyServerTime(serverTime, localTime) {
        Logger.warn("serverTime = ", serverTime)
        Logger.warn("localTime = ", localTime)

        const newTimeOffset = serverTime - Math.floor((localTime || tsNow()) / 1000)
        const changed = Math.abs(this.timeOffset - newTimeOffset) > 10

        Logger.warn("newTimeOffset = ", newTimeOffset)

        Storage.set("server_time_offset", newTimeOffset)

        this.lastMessageID = [0, 0]
        this.timeOffset = newTimeOffset

        Logger.debug("Apply server timeManager", serverTime, localTime, newTimeOffset, changed)

        return changed
    }
}

const mtpTimeManager = new MtpTimeManager()

export function tsNow(seconds) {
    let t = +new Date() + (mtpTimeManager.timeOffset || 0)
    return seconds ? Math.floor(t / 1000) : t
}

export default mtpTimeManager