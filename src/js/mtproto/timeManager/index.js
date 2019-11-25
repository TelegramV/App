import {AppTemporaryStorage} from "../../common/storage"
import {longFromInts} from "../utils/bin"
import {createLogger} from "../../common/logger"
import Random from "../utils/random"

const Logger = createLogger("MtpTimeManager", {
    level: "log"
})

export class MtpTimeManager {
    constructor() {
        this.lastMessageID = [0, 0]
        this.timeOffset = 0

        if (AppTemporaryStorage.exists("server_time_offset")) {
            this.timeOffset = AppTemporaryStorage.getItem("server_time_offset")
        }
    }

    generateMessageID() {
        const timeTicks = tsNow()
        const timeSec = Math.floor(timeTicks / 1000) + this.timeOffset
        const timeMSec = timeTicks % 1000
        const random = Random.nextInteger(0xFFFF)

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

        AppTemporaryStorage.setItem("server_time_offset", newTimeOffset)

        this.lastMessageID = [0, 0]
        this.timeOffset = newTimeOffset

        Logger.debug("Apply server timeManager", serverTime, localTime, newTimeOffset, changed)

        return changed
    }
}

export const TimeManager = new MtpTimeManager()

export function tsNow(seconds) {
    let t = +new Date() + (TimeManager.timeOffset || 0)
    return seconds ? Math.floor(t / 1000) : t
}

export default TimeManager
