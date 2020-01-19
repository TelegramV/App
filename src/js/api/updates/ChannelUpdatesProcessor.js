import MTProto from "../../mtproto"
import PeersStore from "../store/peersStore"
import PeersManager from "../peers/peersManager"
import {Peer} from "../dataObjects/peer/peer"
import AppEvents from "../eventBus/appEvents"

/**
 * @param rawUpdate
 * @return {boolean}
 */
function hasUpdatePts(rawUpdate) {
    return rawUpdate.hasOwnProperty("pts")
}

/**
 * @param rawUpdate
 * @return {boolean}
 */
function hasUpdatePtsCount(rawUpdate) {
    return rawUpdate.hasOwnProperty("pts_count")
}


/**
 * @param {Peer} peer
 * @param rawUpdate
 * @param onSuccess
 * @param onFail
 */
function checkChannelUpdatePts(peer, rawUpdate, {onSuccess, onFail}) {
    if (hasUpdatePts(rawUpdate) && hasUpdatePtsCount(rawUpdate)) {
        if ((peer.dialog.pts + rawUpdate.pts_count) === rawUpdate.pts) {
            onSuccess(MTProto.UpdatesManager.UPDATE_CAN_BE_APPLIED)
        } else if ((peer.dialog.pts + rawUpdate.pts_count) > rawUpdate.pts) {
            console.debug("[channel] update already processed")
            onSuccess(MTProto.UpdatesManager.UPDATE_WAS_ALREADY_APPLIED)
        } else {
            console.warn("[channel] channel update cannot be processed", rawUpdate._, peer.dialog.pts, rawUpdate.pts_count, rawUpdate.pts)
            onFail(MTProto.UpdatesManager.UPDATE_CANNOT_BE_APPLIED)
        }
    } 
    // else if (hasUpdatePts(rawUpdate)) {
        // if (peer.dialog.pts === rawUpdate.pts) {
        //     onSuccess(MTProto.UpdatesManager.UPDATE_CAN_BE_APPLIED)
        // } else if (peer.dialog.pts > rawUpdate.pts) {
        //     console.debug("[channel] [no pts_count] channel update already processed")
        //     onSuccess(MTProto.UpdatesManager.UPDATE_WAS_ALREADY_APPLIED)
        // } else {
        //     console.warn("[channel] [no pts_count] channel update cannot be processed", rawUpdate._, peer.dialog.pts, rawUpdate.pts)
        //     onFail(MTProto.UpdatesManager.UPDATE_CANNOT_BE_APPLIED)
        // }
    // }
    else {
        console.debug("[channel] channel update has no pts")
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
        this.updatesManager.fire(rawUpdate)
    }

    enqueue(rawUpdate) {
        if (!this.isWaitingForDifference) {
            if (this.updateTypes.includes(rawUpdate._)) {
                this.queue.push(rawUpdate)

                this.processQueue()
            } else
                // should never be true, but who knows
                if (this.differenceUpdateTypes.includes(rawUpdate._)) {
                this.processDifference(rawUpdate)
            }
        } else {
            this.queue.push(rawUpdate)
            console.warn("[channel] waiting for diff")
        }
    }

    dequeue() {
        return this.queue.shift()
    }


    processQueue(next) {
        if ((next || this.queue.length > 0) && !this.queueIsProcessing) {
            if (this.isWaitingForDifference) {
                console.error("[channel] BUG: processing queue while waiting for difference")
            }

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
                console.error("BUG: dialog was not found! we should fetch new!", rawUpdate)
                this.queueIsProcessing = false
                this.processQueue()
                return
            }

            const self = this

            checkChannelUpdatePts(peer, rawUpdate, {
                onSuccess(type) {
                    if (type === MTProto.UpdatesManager.UPDATE_CAN_BE_APPLIED) {
                        peer.dialog.pts = rawUpdate.pts
                        self.applyUpdate(rawUpdate)
                    } else if (type === MTProto.UpdatesManager.UPDATE_HAS_NO_PTS) {
                        self.applyUpdate(rawUpdate)
                    }

                    self.queueIsProcessing = false
                    self.processQueue()
                },
                onFail(type) {
                    self.isWaitingForDifference = true
                    self.queueIsProcessing = false

                    let inputPeer = peer.input

                    if (!peer.dialog) {
                        console.error("BUG: dialog wan not found, processing next update")
                        self.isWaitingForDifference = false
                        this.processQueue()
                        return
                    }

                    if (peer.isMin) {
                        console.error("BUG: peer is min, processing next update")
                        self.isWaitingForDifference = false
                        peer.dialog.pts = rawUpdate.pts
                        this.processQueue()
                        return
                    }

                    self.getChannelDifference(inputPeer, peer.dialog.pts, peer).then(rawDifference => {
                        self.processDifference(rawDifference)
                    }).catch(e => {
                        console.error("BUG: channel difference obtaining failed", e)
                        self.isWaitingForDifference = false
                        self.processQueue()
                    })
                }
            })
        }
    }

    processDifference(rawDifferenceWithPeer) {
        console.debug("[channel] got difference", rawDifferenceWithPeer)

        if (rawDifferenceWithPeer._ === "updates.channelDifference") {

            rawDifferenceWithPeer.users.forEach(user => PeersManager.setFromRawAndFire(user))
            rawDifferenceWithPeer.chats.forEach(chat => PeersManager.setFromRawAndFire(chat))

            rawDifferenceWithPeer.new_messages.forEach(message => {
                this.updatesManager.processUpdate("updateNewChannelMessage", {
                    _: "updateNewChannelMessage",
                    message,
                })
            })

            rawDifferenceWithPeer.other_updates.forEach(ou => {
                this.updatesManager.processUpdate(ou._, ou)
            })

            // if not final then fetch next diff with provided pts
            if (rawDifferenceWithPeer.pFlags.final === true) {
                console.warn("difference is final", rawDifferenceWithPeer)

                this.isWaitingForDifference = false
                rawDifferenceWithPeer.__peer.dialog.pts = rawDifferenceWithPeer.pts
                this.processQueue()

            } else {
                console.warn("[channel] difference is not final", rawDifferenceWithPeer)

                this.isWaitingForDifference = true

                this.getChannelDifference(rawDifferenceWithPeer.__channel, rawDifferenceWithPeer.pts, rawDifferenceWithPeer.__peer).then(rawDifference => {
                    this.processDifference(rawDifference)
                }).catch(e => {
                    console.error("BUG: channel difference obtaining failed", e)

                    this.isWaitingForDifference = false
                    this.processQueue()
                })
            }
        } else if (rawDifferenceWithPeer._ === "updates.channelDifferenceTooLong") {
            console.error("difference too long", rawDifferenceWithPeer)

            AppEvents.Dialogs.fire("ChannelRefreshCausedByDifferenceTooLong", {
                rawDifference: rawDifferenceWithPeer
            })

            this.isWaitingForDifference = false

            this.processQueue()

        } else if (rawDifferenceWithPeer._ === "updates.channelDifferenceEmpty") {
            console.warn("difference empty")

            this.isWaitingForDifference = false
            rawDifferenceWithPeer.__peer.dialog.pts = rawDifferenceWithPeer.pts

            this.processQueue()
        } else {
            this.isWaitingForDifference = false
            console.error("BUG: invalid difference constructor")
            this.processQueue()
        }
    }

    getChannelDifference(channel, pts, peer) {
        if (!(peer instanceof Peer)) {
            return Promise.reject("provided peer is invalid")
        }

        console.warn("[channel] fetching difference")

        return MTProto.invokeMethod("updates.getChannelDifference", {
            flags: 0,
            force: false,
            channel: channel,
            filter: {
                "_": "channelMessagesFilterEmpty"
            },
            pts: pts,
            limit: 100,
        }).then(rawDifference => {
            rawDifference.__channel = channel
            rawDifference.__peer = peer
            return rawDifference
        })
    }
}