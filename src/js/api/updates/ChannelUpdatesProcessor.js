import MTProto from "../../mtproto"
import PeersStore from "../store/peersStore"
import PeersManager from "../peers/peersManager"

/**
 * @param rawUpdate
 * @return {boolean}
 */
function hasUpdatePts(rawUpdate) {
    return "pts" in rawUpdate
}

/**
 * @param rawUpdate
 * @return {boolean}
 */
function hasUpdatePtsCount(rawUpdate) {
    return "pts_count" in rawUpdate
}


/**
 * @param {Peer} peer
 * @param rawUpdate
 * @param onSuccess
 * @param onFail
 */
function checkChannelUpdatePts(peer, rawUpdate, {onSuccess, onFail}) {
    if (hasUpdatePtsCount(rawUpdate)) {
        if ((peer.dialog.pts + rawUpdate.pts_count) === rawUpdate.pts) {
            onSuccess(MTProto.UpdatesManager.UPDATE_CAN_BE_APPLIED)
        } else if ((peer.dialog.pts + rawUpdate.pts_count) > rawUpdate.pts) {
            console.log("channel update already processed")
            onSuccess(MTProto.UpdatesManager.UPDATE_WAS_ALREADY_APPLIED)
        } else {
            console.warn("channel update cannot be processed", rawUpdate._, peer.dialog.pts, rawUpdate.pts_count, rawUpdate.pts)
            onFail(MTProto.UpdatesManager.UPDATE_CANNOT_BE_APPLIED)
        }
    } else {
        console.log("channel update has no pts")
        onSuccess(MTProto.UpdatesManager.UPDATE_HAS_NO_PTS)
    }
}

export class ChannelUpdatesProcessor {
    /**
     * @param {UpdateManager} updatesManager
     */
    constructor(updatesManager) {
        this.updatesManager = updatesManager

        this.updateTypes = [
            "updateChannel",
            "updateNewChannelMessage",
            "updateReadChannelInbox",
            "updateDeleteChannelMessages",
            "updateChannelMessageViews",
            "updateEditChannelMessage",
            "updateChannelPinnedMessage",
            "updateReadChannelOutbox",
            "updateChannelWebPage",
            "updateChannelReadMessagesContents",
            "updateChannelAvailableMessages",
        ]

        this.differenceUpdateTypes = [
            "updates.channelDifferenceEmpty",
            "updates.channelDifferenceTooLong",
            "updates.channelDifference",
        ]


        this.queueIsProcessing = false
        this.isWaitingForDifference = false

        /**
         * @private
         */
        this.queue = []
    }

    applyUpdate(rawUpdate) {
        this.updatesManager.resolveUpdateListeners(rawUpdate)
    }

    enqueue(rawUpdate) {
        if (!this.isWaitingForDifference) {
            if (this.updateTypes.includes(rawUpdate._)) {
                this.queue.push(rawUpdate)

                this.processQueue()
            } else if (this.differenceUpdateTypes.includes(rawUpdate._)) {
                this.processDifference(rawUpdate)
            } else {
                console.error("[channel] unexpected update")
            }
        } else if (this.differenceUpdateTypes.includes(rawUpdate._)) {
            this.processDifference(rawUpdate)
        } else {
            console.warn("[channel] waiting for diff")
        }
    }

    dequeue() {
        return this.queue.shift()
    }


    processQueue(next) {
        if ((next || this.queue.length > 0) && !this.queueIsProcessing) {
            this.queueIsProcessing = true

            const rawUpdate = next ? next : this.dequeue()

            let channelId = undefined

            if (rawUpdate._ === "updateNewChannelMessage") {
                channelId = rawUpdate.message.to_id.channel_id
            } else if (rawUpdate._ === "updateEditChannelMessage") {
                channelId = rawUpdate.message.to_id.channel_id
            } else if (rawUpdate._ === "updateDeleteChannelMessages") {
                channelId = rawUpdate.channel_id
            } else if (rawUpdate.channel_id) {
                channelId = rawUpdate.channel_id
            } else {
                console.error("channel id was not found! (fixme)", rawUpdate)
            }

            const peer = PeersStore.get("channel", channelId)

            if (!peer.dialog) {
                console.error("dialog was not found! potential bug! we should fetch new!")
                return
            }

            const self = this

            checkChannelUpdatePts(peer, rawUpdate, {
                onSuccess(type) {
                    if (type === MTProto.UpdatesManager.UPDATE_HAS_NO_PTS) {
                        self.applyUpdate(rawUpdate)
                    } else if (type === MTProto.UpdatesManager.UPDATE_WAS_ALREADY_APPLIED) {

                    } else {
                        peer.dialog.pts = rawUpdate.pts
                        self.applyUpdate(rawUpdate)
                    }

                    self.queueIsProcessing = false
                },
                onFail(type) {
                    self.queueIsProcessing = false
                    self.isWaitingForDifference = true

                    console.log("fetching difference")

                    let inputPeer = peer.input

                    if (!peer.dialog) {
                        console.error("BUG: dialog wan not found, processing next update")
                        self.isWaitingForDifference = false
                        return
                    }

                    if (peer.isMin) {
                        console.error("BUG: peer is min, processing next update")
                        self.isWaitingForDifference = false
                        peer.dialog.pts = rawUpdate.pts
                        return
                    }

                    self.getChannelDifference(inputPeer, peer.dialog.pts, peer).then(rawDifference => {
                        self.isWaitingForDifference = false
                        peer.dialog.pts = rawDifference.pts
                        self.processDifference(rawDifference)
                    }).catch(e => {
                        console.error("BUG: channel difference obtaining failed", e)
                        self.isWaitingForDifference = false
                    })
                }
            })
        }
    }

    processDifference(rawDifference) {
        console.log("got channel difference", rawDifference)
        this.isWaitingForDifference = false

        if (rawDifference._ === "updates.channelDifference") {

            rawDifference.users.forEach(user => PeersManager.setFromRawAndFire(user))
            rawDifference.chats.forEach(chat => PeersManager.setFromRawAndFire(chat))

            rawDifference.new_messages.forEach(message => {
                this.updatesManager.processUpdate("updateNewChannelMessage", {
                    _: "updateNewChannelMessage",
                    message,
                })
            })

            rawDifference.other_updates.forEach(ou => {
                this.updatesManager.processUpdate(ou._, ou)
            })

            if (rawDifference.pFlags.final === true) {
                console.warn("difference is final", rawDifference)

            } else {
                console.warn("difference is not final", rawDifference)
                this.isWaitingForDifference = true

                this.getChannelDifference(rawDifference.__channel, rawDifference.pts, rawDifference.peer).then(rawDifference => {
                    rawDifference.peer.dialog.pts = rawDifference.pts
                    self.processDifference(rawDifference)
                }).catch(e => {
                    console.error("BUG: difference obtaining failed", e)
                })
            }
        } else if (rawDifference._ === "updates.channelDifferenceTooLong") {
            console.error("difference too long", rawDifference)


        } else if (rawDifference._ === "updates.channelDifferenceEmpty") {
            console.warn("difference empty")

            // dialog.pts = _difference.pts
        } else {
            console.error("BUG: invalid difference constructor")
        }
    }

    getChannelDifference(channel, pts, peer) {
        return MTProto.invokeMethod("updates.getChannelDifference", {
            flags: 0,
            force: false,
            channel: channel,
            filter: {
                "_": "channelMessagesFilterEmpty"
            },
            pts: pts,
            limit: 10,
        }).then(rawDifference => {
            rawDifference.__channel = channel
            rawDifference.__peer = peer
            return rawDifference
        })
    }
}