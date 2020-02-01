import {longFromInts} from "../utils/bin"
import Random from "../utils/random"
import {MTProtoTempStorage} from "../MTProtoTempStorage"
import AppConfiguration from "../../configuration"

export class MtpTimeManager {
    constructor() {
        this.lastMessageID = {}
        this.timeOffset = {}
    }

    generateMessageID(dcId) {
        if (!this.lastMessageID[dcId]) {
            this.lastMessageID[dcId] = [0, 0]
        }

        if (!this.timeOffset[dcId]) {
            this.timeOffset[dcId] = 0
        }

        const timeTicks = tsNow()
        const timeSec = Math.floor(timeTicks / 1000) + this.timeOffset[dcId]
        const timeMSec = timeTicks % 1000
        const random = Random.nextInteger(0xFFFF)

        let messageID = [timeSec, (timeMSec << 21) | (random << 3) | 4]

        if (this.lastMessageID[dcId][0] > messageID[0] || this.lastMessageID[dcId][0] === messageID[0] && this.lastMessageID[1] >= messageID[1]) {
            messageID = [this.lastMessageID[dcId][0], this.lastMessageID[dcId][1] + 4]
        }

        this.lastMessageID[dcId] = messageID

        return longFromInts(messageID[0], messageID[1])
    }

    applyServerTime(dcId, serverTime, localTime) {
        // Logger.warn("serverTime = ", serverTime)
        // Logger.warn("localTime = ", localTime)


        if (!this.timeOffset[dcId]) {
            this.timeOffset[dcId] = 0
        }

        const newTimeOffset = serverTime - Math.floor((localTime || tsNow()) / 1000)
        const changed = Math.abs(this.timeOffset[dcId] - newTimeOffset) > 10

        // Logger.warn("newTimeOffset = ", newTimeOffset)

        MTProtoTempStorage.setItem("server_time_offset_dc" + dcId, newTimeOffset)

        this.lastMessageID[dcId] = [0, 0]
        this.timeOffset[dcId] = newTimeOffset

        // Logger.debug("Apply server timeManager", serverTime, localTime, newTimeOffset, changed)

        return changed
    }
}

export const TimeManager = new MtpTimeManager()

export function tsNow(seconds, dcId) {
    let t = +new Date() + (TimeManager.timeOffset[dcId !== undefined ? dcId : AppConfiguration.mtproto.dataCenter.default] || 0)
    return seconds ? Math.floor(t / 1000) : t
}

export default TimeManager
