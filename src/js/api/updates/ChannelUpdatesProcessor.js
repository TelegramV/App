import MTProto from "../../mtproto/external"
import PeersStore from "../store/PeersStore"
import PeersManager from "../peers/PeersManager"
import {Peer} from "../dataObjects/peer/Peer"
import AppEvents from "../eventBus/AppEvents"
import {tsNow} from "../../mtproto/timeManager"

/**
 * @param rawUpdate
 * @return {boolean}
 */
function hasUpdatePts(rawUpdate) {
    return rawUpdate.pts !== undefined
}

/**
 * @param rawUpdate
 * @return {boolean}
 */
function hasUpdatePtsCount(rawUpdate) {
    return rawUpdate.pts_count !== undefined
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
            // console.debug("[channel] update already processed (it is actually bug, but should work anyway)")
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

        this.customUpdateTypeProcessors = new Map([
            ["updateNewChannelMessage", this.processNewChannelMessageQueue]
        ])

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

        /**
         * @type {Map<number, {isProcessing: boolean, isWaitingForDifference: boolean, queue: Array}>}
         */
        this.queues = new Map()

        this.latestDifferenceTime = Number.MAX_VALUE

        this.latestDifferencePeer = undefined
    }

    applyUpdate(rawUpdate) {
        this.updatesManager.fire(rawUpdate)
    }

    enqueue(rawUpdate) {
        let channelId = this.getChannelIdFromUpdate(rawUpdate)

        if (!channelId) {
            console.error("BUG: update without channel_id was passed")
            return
        }

        if (!this.queues.has(channelId)) {
            this.queues.set(channelId, {
                isProcessing: false,
                isWaitingForDifference: false,
                queue: [],
            })
        }

        const channelQueue = this.queues.get(channelId)

        if (!channelQueue.isWaitingForDifference) {
            if (this.updateTypes.includes(rawUpdate._)) {
                channelQueue.queue.push(rawUpdate)

                this.processQueue(channelId)
            } else
                // should never be true, but who knows
            if (this.differenceUpdateTypes.includes(rawUpdate._)) {
                console.error("BUG: difference was passed to enqueue")
            }
        } else {
            channelQueue.queue.push(rawUpdate)

            // console.warn("[channel] waiting for diff")
        }
    }

    processQueue(channelId) {
        const channelQueue = this.queues.get(channelId)

        if (!channelQueue) {
            return
        }

        const queue = channelQueue.queue

        if ((queue.length > 0) && !channelQueue.isProcessing) {
            if (channelQueue.isWaitingForDifference) {
                console.error("[channel] BUG: processing queue while waiting for difference")
                return
            }

            channelQueue.isProcessing = true

            const rawUpdate = channelQueue.queue.shift()

            console.log(rawUpdate._)

            if (this.customUpdateTypeProcessors.has(rawUpdate._)) {
                this.customUpdateTypeProcessors.get(rawUpdate._)(channelId, rawUpdate)
                channelQueue.isProcessing = false
                return
            } else {
                return
            }

            if (!channelId) {
                channelQueue.isProcessing = false
                this.processQueue(channelId)
            }

            const peer = PeersStore.get("channel", channelId)

            if (!peer) {
                channelQueue.isProcessing = false
                this.applyUpdate(rawUpdate)
                this.processQueue(channelId)
            }

            if (!peer.dialog) {
                console.error("BUG: dialog was not found! we should fetch new!", peer, rawUpdate)
                channelQueue.isProcessing = false
                this.applyUpdate(rawUpdate)
                this.processQueue(channelId)
            }

            if (peer.dialog.pts === -1) {
                console.warn("found dialog created manually", peer, rawUpdate)
                channelQueue.isProcessing = false
                peer.dialog.pts = rawUpdate.pts || -1
                this.applyUpdate(rawUpdate)
                this.processQueue(channelId)
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

                    channelQueue.isProcessing = false
                    self.processQueue(channelId)
                },
                onFail(type) {
                    self.latestDifferenceTime = tsNow(true)
                    channelQueue.isWaitingForDifference = true
                    channelQueue.isProcessing = false

                    if (peer.isMin) {
                        console.error("BUG: peer is min, processing next update", peer)
                        channelQueue.isWaitingForDifference = false
                        peer.dialog.pts = rawUpdate.pts
                        self.processQueue(channelId)
                        return
                    }

                    self.getChannelDifference(peer).then(rawDifference => {
                        self.processDifference(channelQueue, rawDifference)
                    }).catch(e => {
                        console.error("BUG: channel difference obtaining failed", e)
                        channelQueue.isWaitingForDifference = false
                        self.processQueue(channelId)
                    })
                }
            })
        }
    }

    processNewChannelMessageQueue(channelId, rawUpdate) {
        console.log("processing channel q", channelId, rawUpdate)
    }

    processDifference(channelQueue, rawDifferenceWithPeer) {
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
                channelQueue.isWaitingForDifference = false
                this.processQueue()

            } else {
                // console.warn("[channel] difference is not final", rawDifferenceWithPeer)

                channelQueue.isWaitingForDifference = true

                // comment below if there are gaps
                rawDifferenceWithPeer.__peer.dialog.pts = rawDifferenceWithPeer.pts

                this.getChannelDifference(rawDifferenceWithPeer.__peer).then(rawDifference => {
                    this.processDifference(channelQueue, rawDifference)
                }).catch(e => {
                    console.error("BUG: channel difference obtaining failed", e)

                    channelQueue.isWaitingForDifference = false
                    this.processQueue()
                })
            }
        } else if (rawDifferenceWithPeer._ === "updates.channelDifferenceTooLong") {
            console.error("difference too long", rawDifferenceWithPeer)

            AppEvents.Dialogs.fire("ChannelRefreshCausedByDifferenceTooLong", {
                rawDifference: rawDifferenceWithPeer
            })

            channelQueue.isWaitingForDifference = false

            this.processQueue()

        } else if (rawDifferenceWithPeer._ === "updates.channelDifferenceEmpty") {
            // console.warn("difference empty")


            AppEvents.General.fire("gotDifference", {
                diffType: 0 // channel
            })

            channelQueue.isWaitingForDifference = false
            rawDifferenceWithPeer.__peer.dialog.pts = rawDifferenceWithPeer.pts

            this.processQueue()
        } else {
            channelQueue.isWaitingForDifference = false
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
        this.latestDifferenceTime = tsNow(true)

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

    getChannelIdFromUpdate(rawUpdate) {
        if (rawUpdate._ === "updateNewChannelMessage") {
            return rawUpdate.message.to_id.channel_id
        } else if (rawUpdate._ === "updateEditChannelMessage") {
            return rawUpdate.message.to_id.channel_id
        } else if (rawUpdate._ === "updateDeleteChannelMessages") {
            return rawUpdate.channel_id
        } else if (rawUpdate.channel_id) {
            return rawUpdate.channel_id
        } else {
            console.error("channel id was not found! (fixme)", rawUpdate)
            return undefined
        }
    }
}