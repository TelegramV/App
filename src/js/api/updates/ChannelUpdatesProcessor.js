import MTProto from "../../mtproto"
import PeersStore from "../store/PeersStore"
import PeersManager from "../peers/PeersManager"
import {Peer} from "../dataObjects/peer/Peer"
import AppEvents from "../eventBus/AppEvents"
import AppConnectionStatus from "../../ui/reactive/ConnectionStatus"
import {tsNow} from "../../mtproto/timeManager"

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
            console.debug("[channel] update already processed (it is actually bug, but should work anyway)")
            onSuccess(MTProto.UpdatesManager.UPDATE_WAS_ALREADY_APPLIED)
        } else {
            // console.warn("[channel] channel update cannot be processed", rawUpdate._, peer.dialog.pts, rawUpdate.pts_count, rawUpdate.pts)
            onFail(MTProto.UpdatesManager.UPDATE_CANNOT_BE_APPLIED)
        }
    } else {
        // console.debug("[channel] channel update has no pts")
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

        this.latestDifferenceTime = 0

        this.latestDifferencePeer = undefined
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
                console.error("BUG: difference was passed to enqueue")
            }
        } else {
            // console.log("got update", rawUpdate)
            if ((this.latestDifferenceTime + 2) < tsNow(true)) {
                AppEvents.General.fire("waitingForDifference", {
                    diffType: 0 // channel
                })
            }

            if ((this.latestDifferenceTime + 10) < tsNow(true) && AppConnectionStatus.Status !== AppConnectionStatus.WAITING_FOR_NETTWORK) {
                // this.isWaitingForDifference = true
                // this.queueIsProcessing = false
                // console.warn("refetching difference")
                //
                // this.getChannelDifference(this.latestDifferencePeer).then(rawDifference => {
                //     this.processDifference(rawDifference)
                // }).catch(e => {
                //     console.error("[default] BUG: difference refetching failed", e)
                //     this.isWaitingForDifference = false
                //     this.queueIsProcessing = false
                //     this.processQueue()
                // })
            }

            this.queue.push(rawUpdate)
            // console.warn("[channel] waiting for diff")
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

            if (!peer) {
                this.queueIsProcessing = false
                this.applyUpdate(rawUpdate)
                this.processQueue()
            }

            if (!peer.dialog) {
                console.error("BUG: dialog was not found! we should fetch new!", peer, rawUpdate)
                this.queueIsProcessing = false
                this.applyUpdate(rawUpdate)
                this.processQueue()
            }

            if (peer.dialog.pts === -1) {
                console.warn("found dialog created manually", peer, rawUpdate)
                this.queueIsProcessing = false
                peer.dialog.pts = rawUpdate.pts || -1
                this.applyUpdate(rawUpdate)
                this.processQueue()
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
                    self.latestDifferenceTime = tsNow(true)
                    self.isWaitingForDifference = true
                    self.queueIsProcessing = false

                    if (peer.isMin) {
                        console.error("BUG: peer is min, processing next update", peer)
                        self.isWaitingForDifference = false
                        peer.dialog.pts = rawUpdate.pts
                        self.processQueue()
                        return
                    }

                    self.getChannelDifference(peer).then(rawDifference => {
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
                // console.warn("difference is final", rawDifferenceWithPeer)


                AppEvents.General.fire("gotDifference", {
                    diffType: 0 // channel
                })

                rawDifferenceWithPeer.__peer.dialog.pts = rawDifferenceWithPeer.pts
                this.isWaitingForDifference = false
                this.processQueue()

            } else {
                // console.warn("[channel] difference is not final", rawDifferenceWithPeer)

                this.isWaitingForDifference = true

                // comment below if there are gaps
                rawDifferenceWithPeer.__peer.dialog.pts = rawDifferenceWithPeer.pts

                this.getChannelDifference(rawDifferenceWithPeer.__peer).then(rawDifference => {
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
            // console.warn("difference empty")


            AppEvents.General.fire("gotDifference", {
                diffType: 0 // channel
            })

            this.isWaitingForDifference = false
            rawDifferenceWithPeer.__peer.dialog.pts = rawDifferenceWithPeer.pts

            this.processQueue()
        } else {
            this.isWaitingForDifference = false
            console.error("BUG: invalid difference constructor")
            this.processQueue()
        }
    }

    /**
     * @param {Peer} peer
     * @return {Promise<never>|Promise<T>}
     */
    getChannelDifference(peer) {
        if (!(peer instanceof Peer)) {
            return Promise.reject("provided peer is invalid")
        }

        this.latestDifferencePeer = peer

        console.warn("[channel] fetching difference")

        return MTProto.invokeMethod("updates.getChannelDifference", {
            flags: 0,
            force: false,
            channel: peer.input,
            filter: {
                "_": "channelMessagesFilterEmpty"
            },
            pts: peer.dialog.pts,
            limit: 100,
        }).then(rawDifference => {
            rawDifference.__channel = peer.input
            rawDifference.__peer = peer
            return rawDifference
        })
    }
}