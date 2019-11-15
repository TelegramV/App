import TimeManager, {tsNow} from "../../mtproto/timeManager"

let channelLocals = {}
let channelsByLocals = {}
let channelCurLocal = 0
let fullMsgIDModulus = 4294967296

let dialogsNum = 0

export function generateDialogIndex(date) {
    if (date === undefined) {
        date = tsNow(true) + TimeManager.timeOffset
    }
    return (date * 0x10000) + ((++dialogsNum) & 0xFFFF)
}

export function getFullMessageID(msgID, channelID) {
    if (!channelID || msgID <= 0) {
        return msgID
    }
    msgID = getMessageLocalID(msgID)
    let localStart = channelLocals[channelID]
    if (!localStart) {
        localStart = (++channelCurLocal) * fullMsgIDModulus
        channelsByLocals[localStart] = channelID
        channelLocals[channelID] = localStart
    }

    return localStart + msgID
}

export function getMessageIDInfo(fullMsgID) {
    if (fullMsgID < fullMsgIDModulus) {
        return [fullMsgID, 0]
    }
    let msgID = fullMsgID % fullMsgIDModulus
    let channelID = channelsByLocals[fullMsgID - msgID]

    return [msgID, channelID]
}

export function getMessageLocalID(fullMsgID) {
    if (!fullMsgID) {
        return 0
    }
    return fullMsgID % fullMsgIDModulus
}

export function splitMessageIDsByChannels(mids) {
    let msgIDsByChannels = {}
    let midsByChannels = {}
    let mid, msgChannel
    let channelID
    for (let i = 0; i < mids.length; i++) {
        mid = mids[i]
        msgChannel = getMessageIDInfo(mid)
        channelID = msgChannel[1]
        if (msgIDsByChannels[channelID] === undefined) {
            msgIDsByChannels[channelID] = []
            midsByChannels[channelID] = []
        }
        msgIDsByChannels[channelID].push(msgChannel[0])
        midsByChannels[channelID].push(mid)
    }

    return {
        msgIDs: msgIDsByChannels,
        mids: midsByChannels
    }
}
