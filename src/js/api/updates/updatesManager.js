import {Manager} from "../manager";
import MTProto from "../../mtproto/external";
import processUpdatesTooLong from "./processUpdatesTooLong"
import processShortMessage from "./processShortMessage"
import processShort from "./processShort"
import processUpdatesCombined from "./processUpdatesCombined"
import processUpdates from "./processUpdates"
import {ChannelUpdatesProcessor} from "./ChannelUpdatesProcessor"
import {DefaultUpdatesProcessor} from "./DefaultUpdatesProcessor"
import processShortSentMessage from "./processShortSentMessage"
import {arrayDelete} from "../../common/utils/utils"
import {tsNow} from "../../mtproto/timeManager"
import AppConnectionStatus from "../../ui/reactive/ConnectionStatus"
import AppEvents from "../eventBus/AppEvents"

class UpdateManager extends Manager {
    constructor() {
        super()

        this._State = {}

        this.UPDATE_CAN_BE_APPLIED = 0
        this.UPDATE_WAS_ALREADY_APPLIED = 1
        this.UPDATE_CANNOT_BE_APPLIED = -1
        this.UPDATE_HAS_NO_PTS = 2

        this.channelUpdatesProcessor = new ChannelUpdatesProcessor(this)
        this.defaultUpdatesProcessor = new DefaultUpdatesProcessor(this)

        /**
         * @type {Map<string, function()[]>}
         */
        this.updateListeners = new Map()

        this.customUpdatesProcessors = new Map([
            ["updatesTooLong", processUpdatesTooLong],
            ["updateShortMessage", processShortMessage],
            ["updateShortChatMessage", processShortMessage],
            ["updateShort", processShort],
            ["updatesCombined", processUpdatesCombined],
            ["updates", processUpdates],
            ["updateShortSentMessage", processShortSentMessage],
        ])
    }

    get State() {
        return this._State
    }

    set State(State) {
        this._State = State
        console.debug("State was set = ", State)
    }

    init() {
        if (this._inited) {
            return Promise.resolve()
        }

        return MTProto.invokeMethod("updates.getState", {}).then(state => {
            this.State = state
            this._inited = true
        }).then(() => {

            if (this.updateStatusCheckingIntervalId === undefined) {
                this.updateStatusCheckingIntervalId = setInterval(() => {
                    if (this.channelUpdatesProcessor.isWaitingForDifference && (this.channelUpdatesProcessor.latestDifferenceTime + 2) <= tsNow(true)) {
                        AppEvents.General.fire("waitingForDifference", {
                            diffType: 0 // channel
                        })
                    }

                    if (this.defaultUpdatesProcessor.isWaitingForDifference && (this.defaultUpdatesProcessor.latestDifferenceTime + 2) <= tsNow(true)) {
                        AppEvents.General.fire("waitingForDifference", {
                            diffType: 1 // default
                        })
                    }

                    // if (this.defaultUpdatesProcessor.isWaitingForDifference && (this.channelUpdatesProcessor.latestDifferenceTime + 5) <= tsNow(true) && AppConnectionStatus.Status !== AppConnectionStatus.WAITING_FOR_NETTWORK) {
                    //     this.channelUpdatesProcessor.isWaitingForDifference = true
                    //     this.channelUpdatesProcessor.queueIsProcessing = false
                    //     this.channelUpdatesProcessor.latestDifferenceTime = tsNow(true)
                    //     console.warn("refetching difference")
                    //
                    //     AppEvents.General.fire("waitingForDifference", {
                    //         diffType: 0 // channel
                    //     })
                    //
                    //     this.channelUpdatesProcessor.getChannelDifference(this.channelUpdatesProcessor.latestDifferencePeer).then(rawDifference => {
                    //         this.channelUpdatesProcessor.processDifference(this.channelUpdatesProcessor.latestDifferencePeer,rawDifference)
                    //     }).catch(e => {
                    //         console.error("[default] BUG: difference refetching failed", e)
                    //         this.channelUpdatesProcessor.isWaitingForDifference = false
                    //         this.channelUpdatesProcessor.queueIsProcessing = false
                    //         this.processQueue()
                    //     })
                    // }

                    if (this.defaultUpdatesProcessor.isWaitingForDifference && (this.defaultUpdatesProcessor.latestDifferenceTime + 5) <= tsNow(true) && AppConnectionStatus.Status !== AppConnectionStatus.WAITING_FOR_NETTWORK) {
                        this.defaultUpdatesProcessor.isWaitingForDifference = true
                        this.defaultUpdatesProcessor.queueIsProcessing = false
                        this.defaultUpdatesProcessor.latestDifferenceTime = tsNow(true)
                        console.warn("refetching difference")

                        AppEvents.General.fire("waitingForDifference", {
                            diffType: 1 // default
                        })

                        this.defaultUpdatesProcessor.getDifference(this.defaultUpdatesProcessor.latestDifferencePeer).then(rawDifference => {
                            this.defaultUpdatesProcessor.processDifference(rawDifference)
                        }).catch(e => {
                            console.error("[default] BUG: difference refetching failed", e)
                            this.defaultUpdatesProcessor.isWaitingForDifference = false
                            this.defaultUpdatesProcessor.queueIsProcessing = false
                            this.processQueue()
                        })
                    }
                }, 1000)
            }
        })
    }

    subscribe(type, listener) {
        let listeners = this.updateListeners.get(type)

        if (!listeners) {
            listeners = this.updateListeners.set(type, []).get(type)
        }

        listeners.push(listener)
    }

    unsubscribe(type, listener) {
        let listeners = this.updateListeners.get(type)

        if (listeners) {
            arrayDelete(listeners, listener)
        }
    }

    fire(rawUpdate) {
        if (this.updateListeners.has(rawUpdate._)) {
            this.updateListeners.get(rawUpdate._).forEach(listener => {
                listener(rawUpdate)
            })
        } else {
            // console.warn("unexpected update = ", rawUpdate._, rawUpdate)
        }
    }

    processUpdate(type, rawUpdate) {
        if (this.channelUpdatesProcessor.updateTypes.includes(rawUpdate._)) {
            this.channelUpdatesProcessor.enqueue(rawUpdate)
        } else {
            this.defaultUpdatesProcessor.enqueue(rawUpdate)
        }
    }

    process(rawUpdate) {
        if (this.customUpdatesProcessors.has(rawUpdate._)) {
            this.customUpdatesProcessors.get(rawUpdate._)(this, rawUpdate)
        } else {
            this.processUpdate(rawUpdate.update._, rawUpdate.update)
        }
    }
}

const UpdatesManager = new UpdateManager()

export default UpdatesManager