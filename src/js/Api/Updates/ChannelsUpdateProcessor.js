import MTProto from "../../MTProto/external"
import PeersStore from "../Store/PeersStore"
import PeersManager from "../Peers/Objects/PeersManager"
import {Peer} from "../Peers/Objects/Peer"
import AppEvents from "../EventBus/AppEvents"
import {checkUpdatePts, UpdatesProcessor, UpdatesQueue} from "./UpdatesProcessor"

class ChannelUpdatesQueue extends UpdatesQueue {

    channelId: number

    constructor(channelId, queue = []) {
        super(queue)
        this.channelId = channelId
    }
}

/**
 * TODO: `updateChannelTooLong` need to be implemented
 */
export class ChannelsUpdateProcessor extends UpdatesProcessor {
    /**
     * @param {UpdateManager} updatesManager
     */
    constructor(updatesManager) {
        super(updatesManager)

        this.customUpdateTypeProcessors = new Map([
            ["updateNewChannelMessage", this.processNewChannelMessageUpdate],
            ["updateChannel", this.processUpdateChannelUpdate],
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
         * @type {Map<number, UpdatesQueue>}
         */
        this.queues = new Map()

        this.latestDifferenceTime = Number.MAX_VALUE

        this.latestDifferencePeer = undefined
    }

    enqueue(rawUpdate) {
        let channelId = this.getChannelIdFromUpdate(rawUpdate)

        if (!channelId) {
            console.error("BUG: update without channel_id was passed")
            return
        }

        if (!this.queues.has(channelId)) {
            this.queues.set(channelId, new ChannelUpdatesQueue(channelId))
        }

        const channelQueue = this.queues.get(channelId)

        if (!channelQueue.isWaitingForDifference) {
            if (this.updateTypes.includes(rawUpdate._)) {
                channelQueue.push(rawUpdate)

                this.processQueue(channelQueue)
            } else
                // should never be true, but who knows
            if (this.differenceUpdateTypes.includes(rawUpdate._)) {
                console.error("BUG: difference was passed to enqueue")
            }
        } else {
            channelQueue.push(rawUpdate)

            // console.warn("[channel] waiting for diff")
        }
    }

    processQueue(channelQueue: ChannelUpdatesQueue) {
        if (!channelQueue) {
            return
        }

        const queue = channelQueue

        if ((queue.length > 0) && !channelQueue.isProcessing) {
            if (channelQueue.isWaitingForDifference) {
                console.error("[channel] BUG: processing queue while waiting for difference")
                return
            }

            channelQueue.isProcessing = true

            const rawUpdate = queue.shift()

            if (!rawUpdate) {
                channelQueue.isProcessing = false
            }

            if (this.customUpdateTypeProcessors.has(rawUpdate._)) {
                this.customUpdateTypeProcessors.get(rawUpdate._)(channelQueue, rawUpdate)
                channelQueue.isProcessing = false
                return
            }

            const peer = PeersStore.get("channel", channelQueue.channelId)

            // ignore if no peer found
            if (!peer) {
                channelQueue.isProcessing = false
                this.processQueue(channelQueue)
                return
            }

            // ignore if no dialog found
            if (!peer.dialog) {
                console.error("BUG: dialog was not found! we should fetch new!", peer, rawUpdate)
                channelQueue.isProcessing = false
                this.processQueue(channelQueue)
                return
            }

            if (peer.dialog.pts === -1) {
                console.warn("Very BAD BUG: found dialog created manually", peer, rawUpdate)
                channelQueue.isProcessing = false
                this.processQueue(channelQueue)
                return
            }

            this.processWithValidation(channelQueue, rawUpdate, peer)

        }
    }

    processWithValidation(queue: UpdatesQueue, rawUpdate, peer: Peer) {
        if (peer) {
            rawUpdate.__peer = peer
        } else {
            return
        }

        checkUpdatePts(peer.dialog.pts, rawUpdate, {
            onSuccess: (type) => {
                if (type === MTProto.UpdatesManager.UPDATE_CAN_BE_APPLIED) {
                    peer.dialog.pts = rawUpdate.pts
                    this.applyUpdate(rawUpdate)
                } else if (type === MTProto.UpdatesManager.UPDATE_HAS_NO_PTS) {
                    this.applyUpdate(rawUpdate)
                }

                queue.isProcessing = false
                this.processQueue(queue)
            },
            onFail: (type) => {
                this.latestDifferenceTime = MTProto.TimeManager.now(true)
                queue.isWaitingForDifference = true
                queue.isProcessing = false

                if (peer.isMin) {
                    console.error("BUG: peer is min, processing next update", peer)
                    queue.isWaitingForDifference = false
                    peer.dialog.pts = rawUpdate.pts
                    this.processQueue(queue)
                    return
                }

                this.getChannelDifference(peer).then(rawDifference => {
                    this.processDifference(queue, rawDifference)
                }).catch(e => {
                    console.error("BUG: channel difference obtaining failed", e)
                    queue.isWaitingForDifference = false
                    this.processQueue(queue)
                })
            }
        })
    }


    processNewChannelMessageUpdate = (channelQueue, rawUpdate) => {

        if (!channelQueue) {
            console.error("BUG: invalid channelQueue was passed")
            return
        }

        const peer = PeersStore.get("channel", channelQueue.channelId)

        // ignore and pass to higher level if no peer found
        if (!peer) {
            console.log("no peer new channel message", rawUpdate)

            channelQueue.isProcessing = false
            rawUpdate._ = "updateNewChannelMessageNoPeer"

            this.applyUpdate(rawUpdate)

            this.processQueue(channelQueue)
            return
        }

        // ignore and pass to higher level if no dialog found
        if (!peer.dialog) {
            console.log("no dialog new channel message", rawUpdate, peer)

            channelQueue.isProcessing = false
            rawUpdate._ = "updateNewChannelMessageNoDialog"
            rawUpdate.__peer = peer

            this.applyUpdate(rawUpdate)

            this.processQueue(channelQueue)
            return
        }

        this.processWithValidation(channelQueue, rawUpdate, peer)
    }

    processUpdateChannelUpdate = (channelQueue, rawUpdate) => {

        if (!channelQueue) {
            console.error("BUG: invalid channelQueue was passed")
            return
        }

        const peer = PeersStore.get("channel", channelQueue.channelId)

        // ignore and pass to higher level if no peer found
        if (!peer) {
            channelQueue.isProcessing = false
            rawUpdate._ = "updateChannelNoPeer"

            this.applyUpdate(rawUpdate)

            this.processQueue(channelQueue)
            return
        }

        // ignore and pass to higher level if no dialog found
        if (!peer.dialog) {
            console.log("peer", peer)
            channelQueue.isProcessing = false
            rawUpdate._ = "updateChannelNoDialog"
            rawUpdate.__peer = peer

            this.applyUpdate(rawUpdate)

            this.processQueue(channelQueue)
            return
        }

        this.processWithValidation(channelQueue, rawUpdate, peer)
    }

    processDifference(channelQueue, rawDifferenceWithPeer) {
        console.debug("[channel] got difference", rawDifferenceWithPeer)

        if (rawDifferenceWithPeer._ === "updates.channelDifference") {

            PeersManager.fillPeersFromUpdate(rawDifferenceWithPeer)

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
                this.processQueue(channelQueue)

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
                    this.processQueue(channelQueue)
                })
            }
        } else if (rawDifferenceWithPeer._ === "updates.channelDifferenceTooLong") {
            console.error("difference too long", rawDifferenceWithPeer)

            this.applyUpdate(rawDifferenceWithPeer)

            AppEvents.General.fire("gotDifference", {
                diffType: 0 // channel
            })

            channelQueue.isWaitingForDifference = false

            this.processQueue(channelQueue)

        } else if (rawDifferenceWithPeer._ === "updates.channelDifferenceEmpty") {
            // console.warn("difference empty")


            AppEvents.General.fire("gotDifference", {
                diffType: 0 // channel
            })

            channelQueue.isWaitingForDifference = false
            rawDifferenceWithPeer.__peer.dialog.pts = rawDifferenceWithPeer.pts

            this.processQueue(channelQueue)
        } else {
            channelQueue.isWaitingForDifference = false
            console.error("BUG: invalid difference constructor")
            this.processQueue(channelQueue)
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
        this.latestDifferenceTime = MTProto.TimeManager.now(true)

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