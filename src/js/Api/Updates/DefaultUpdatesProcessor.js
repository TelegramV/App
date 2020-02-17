import {checkUpdatePts, UpdatesProcessor, UpdatesQueue} from "./UpdatesProcessor"
import {UpdateManager} from "./updatesManager"
import MTProto from "../../MTProto/external"
import AppEvents from "../EventBus/AppEvents"
import PeersManager from "../Peers/Objects/PeersManager"

export class DefaultUpdatesProcessor extends UpdatesProcessor {

    differenceUpdateTypes = [
        "updates.differenceEmpty",
        "updates.differenceTooLong",
        "updates.difference",
        "updates.differenceSlice",
    ]

    queue = new UpdatesQueue()

    constructor(updatesManager: UpdateManager) {
        super(updatesManager)

        this.customUpdateTypeProcessors = new Map([
            ["updatePtsChanged", this.processPtsChanged],
        ])
    }

    enqueue(rawUpdate) {
        if (!this.isWaitingForDifference) {
            this.queue.push(rawUpdate)

            this.processQueue(this.queue)
        } else {
            this.queue.push(rawUpdate)
        }
    }

    processQueue(queue: UpdatesQueue = this.queue) {
        if (queue.length > 0 && !queue.isProcessing) {
            if (queue.isWaitingForDifference) {
                console.error("[default] BUG: processing queue while waiting for difference")
                return
            }

            queue.isProcessing = true

            const rawUpdate = queue.shift()

            if (this.customUpdateTypeProcessors.has(rawUpdate._)) {
                this.customUpdateTypeProcessors.get(rawUpdate._)(rawUpdate)
                return
            }

            this.processWithValidation(queue, rawUpdate, this.updatesManager.State.pts)
        }
    }

    processPtsChanged = rawUpdate => {
        this.queue.isProcessing = true

        MTProto.invokeMethod("updates.getState").then(state => {
            this.updatesManager.State = state
            this.queue.isProcessing = false
        })
    }

    processWithValidation(queue: UpdatesQueue, rawUpdate, pts) {
        checkUpdatePts(this.updatesManager.State.pts, rawUpdate, {
            onSuccess: (type) => {
                if (type === this.updatesManager.UPDATE_CAN_BE_APPLIED) {
                    this.updatesManager.State.pts = rawUpdate.pts
                    this.applyUpdate(rawUpdate)
                } else if (type === this.updatesManager.UPDATE_HAS_NO_PTS) {
                    this.applyUpdate(rawUpdate)
                }

                this.queue.isProcessing = false
                this.processQueue(this.queue)
            },
            onFail: (type) => {
                this.latestDifferenceTime = MTProto.TimeManager.now(true)
                this.queue.isWaitingForDifference = true
                this.queue.isProcessing = false

                this.getDifference(this.updatesManager.State).then(rawDifference => {
                    this.processDifference(rawDifference)
                }).catch(e => {
                    console.error("[default] BUG: difference obtaining failed", e)
                    this.queue.isWaitingForDifference = false
                    this.queue.isProcessing = false
                    this.processQueue(this.queue)
                })
            }
        })
    }

    processDifference(rawDifference) {
        console.debug("[default] got difference", rawDifference)

        if (rawDifference._ === "updates.difference") {

            AppEvents.General.fire("gotDifference", {
                diffType: 1 // channel
            })

            PeersManager.fillPeersFromUpdate(rawDifference)

            rawDifference.new_messages.forEach(message => {
                this.updatesManager.processUpdate("updateNewMessage", {
                    _: "updateNewMessage",
                    message,
                })
            })

            rawDifference.new_encrypted_messages.forEach(message => {
                this.updatesManager.processUpdate("updateNewEncryptedMessage", {
                    _: "updateNewEncryptedMessage",
                    message,
                })
            })

            rawDifference.other_updates.forEach(ou => {
                this.updatesManager.processUpdate(ou._, ou)
            })

            this.queue.isWaitingForDifference = false
            this.queue.isProcessing = false
            this.updatesManager.State = rawDifference.state
            this.processQueue(this.queue)

        } else if (rawDifference._ === "updates.differenceTooLong") {
            console.warn("[default] difference too long", rawDifference)

            this.queue.isWaitingForDifference = true

            // The difference is too long, and the specified state must be used to refetch updates.

            this.updatesManager.State.pts = rawDifference.pts

            this.getDifference(this.updatesManager.State).then(rawDifference => {
                this.processDifference(rawDifference)
            }).catch(e => {
                console.error("BUG: difference obtaining failed", e)

                this.queue.isWaitingForDifference = false
                this.queue.isProcessing = false
                this.processQueue(this.queue)
            })

        } else if (rawDifference._ === "updates.differenceEmpty") {
            // console.warn("[default] difference empty")

            AppEvents.General.fire("gotDifference", {
                diffType: 1 // channel
            })

            this.updatesManager.State.date = rawDifference.date
            this.updatesManager.State.qts = rawDifference.qts

            this.queue.isWaitingForDifference = false
            this.queue.isProcessing = false

            this.processQueue(this.queue)

        } else if (rawDifference._ === "updates.differenceSlice") {

            // Incomplete list of occurred events.

            PeersManager.fillPeersFromUpdate(rawDifference)

            rawDifference.new_messages.forEach(message => {
                this.updatesManager.processUpdate("updateNewMessage", {
                    _: "updateNewMessage",
                    message,
                })
            })

            rawDifference.new_encrypted_messages.forEach(message => {
                this.updatesManager.processUpdate("updateNewEncryptedMessage", {
                    _: "updateNewEncryptedMessage",
                    message,
                })
            })

            rawDifference.other_updates.forEach(ou => {
                this.updatesManager.processUpdate(ou._, ou)
            })

            this.updatesManager.State = rawDifference.intermediate_state

            this.getDifference(this.updatesManager.State).then(rawDifference => {
                this.processDifference(rawDifference)
            }).catch(e => {
                console.error("BUG: difference obtaining failed", e)

                this.queue.isWaitingForDifference = false
                this.queue.isProcessing = false
                this.processQueue(this.queue)
            })
        } else {
            console.error("BUG: invalid difference constructor")
        }
    }

    getDifference(State = this.updatesManager.State) {
        if (State.pts === undefined || this.updatesManager.State.pts === undefined) {
            debugger
        }

        this.latestDifferenceTime = MTProto.TimeManager.now(true)

        return MTProto.invokeMethod("updates.getDifference", {
            pts: State.pts || this.updatesManager.State.pts,
            date: State.date || this.updatesManager.State.date,
            qts: State.qts || this.updatesManager.State.qts,
            pts_total_limit: 100,
            flags: 0
        })
    }
}