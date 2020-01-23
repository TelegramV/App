import TimeManager, {tsNow} from "../../mtproto/timeManager"

let dialogsNum = 0

export function generateDialogIndex(date) {
    if (date === undefined) {
        date = tsNow(true) + TimeManager.timeOffset
    }

    return (date * 0x10000) + ((++dialogsNum) & 0xFFFF)
}