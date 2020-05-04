import {Manager} from "../Manager";
import MTProto from "../../MTProto/External";
import processUpdatesTooLong from "./processUpdatesTooLong"
import processShortMessage from "./processShortMessage"
import processShort from "./processShort"
import processUpdatesCombined from "./processUpdatesCombined"
import processUpdates from "./processUpdates"
import {ChannelsUpdateProcessor} from "./ChannelsUpdateProcessor"
import {DefaultUpdatesProcessor} from "./DefaultUpdatesProcessor"
import processShortSentMessage from "./processShortSentMessage"
import {arrayDelete} from "../../Utils/array"
import AppConnectionStatus from "../../Ui/Reactive/ConnectionStatus"
import AppEvents from "../EventBus/AppEvents"
import process_new_session_created from "./process_new_session_created"
import processUpdateUserTyping from "./Update/processUpdateUserTyping"
import processUpdateChatUserTyping from "./Update/processUpdateChatUserTyping"
import processUpdateChannel from "./Update/processUpdateChannel"
import processUpdateReadHistoryInbox from "./Update/processUpdateReadHistoryInbox"
import processUpdateReadHistoryOutbox from "./Update/processUpdateReadHistoryOutbox"
import processUpdateReadChannelInbox from "./Update/processUpdateReadChannelInbox"
import processUpdateReadChannelOutbox from "./Update/processUpdateReadChannelOutbox"
import processUpdateFolderPeers from "./Update/processUpdateFolderPeers"
import processUpdateDialogPinned from "./Update/processUpdateDialogPinned"
import processUpdateUserStatus from "./Update/processUpdateUserStatus"
import processUpdateUserPinnedMessage from "./Update/processUpdateUserPinnedMessage"
import processUpdateChatPinnedMessage from "./Update/processUpdateChatPinnedMessage"
import processUpdateChannelPinnedMessage from "./Update/processUpdateChannelPinnedMessage"
import processUpdateNotifySettings from "./Update/processUpdateNotifySettings"
import processUpdatePhoneCall from "./Update/processUpdatePhoneCall"
import processUpdateUserPhoto from "./Update/processUpdateUserPhoto"
import processUpdateMessageID from "./Update/processUpdateMessageID"
import processUpdateShortSentMessage from "./Update/processUpdateShortSentMessage"
import processUpdateShortMessage from "./Update/processUpdateShortMessage"
import processUpdateShortChatMessage from "./Update/processUpdateShortChatMessage"
import processUpdateNewMessage from "./Update/processUpdateNewMessage"
import processUpdateDeleteChannelMessages from "./Update/processUpdateDeleteChannelMessages"
import processUpdateDeleteMessages from "./Update/processUpdateDeleteMessages"
import processUpdateEditMessage from "./Update/processUpdateEditMessage"
import processUpdateMessagePoll from "./Update/processUpdateMessagePoll"
import processUpdateEditChannelMessage from "./Update/processUpdateEditChannelMessage"
import processUpdateNewChannelMessage from "./Update/processUpdateNewChannelMessage"
import processUpdateDraftMessage from "./Update/processUpdateDraftMessage"

export class UpdateManager extends Manager {
    constructor() {
        super()

        this._State = {}

        this.UPDATE_CAN_BE_APPLIED = 0
        this.UPDATE_WAS_ALREADY_APPLIED = 1
        this.UPDATE_CANNOT_BE_APPLIED = -1
        this.UPDATE_HAS_NO_PTS = 2

        this.channelUpdatesProcessor = new ChannelsUpdateProcessor(this)
        this.defaultUpdatesProcessor = new DefaultUpdatesProcessor(this)

        /**
         * @type {Map<string, function()[]>}
         */
        this.updateListeners = new Map()

        this.subscribe("updateUserTyping", processUpdateUserTyping)
        this.subscribe("updateChatUserTyping", processUpdateChatUserTyping)
        this.subscribe("updateChannel", processUpdateChannel)
        this.subscribe("updateReadHistoryInbox", processUpdateReadHistoryInbox)
        this.subscribe("updateReadHistoryOutbox", processUpdateReadHistoryOutbox)
        this.subscribe("updateReadChannelInbox", processUpdateReadChannelInbox)
        this.subscribe("updateReadChannelOutbox", processUpdateReadChannelOutbox)
        this.subscribe("updateFolderPeers", processUpdateFolderPeers)
        this.subscribe("updateDialogPinned", processUpdateDialogPinned)
        this.subscribe("updateUserStatus", processUpdateUserStatus)
        this.subscribe("updateUserPhoto", processUpdateUserPhoto)
        this.subscribe("updateUserPinnedMessage", processUpdateUserPinnedMessage)
        this.subscribe("updateChatPinnedMessage", processUpdateChatPinnedMessage)
        this.subscribe("updateChannelPinnedMessage", processUpdateChannelPinnedMessage)
        this.subscribe("updateNotifySettings", processUpdateNotifySettings)
        this.subscribe("updatePhoneCall", processUpdatePhoneCall)
        this.subscribe("updateMessageID", processUpdateMessageID)
        this.subscribe("updateShortSentMessage", processUpdateShortSentMessage)
        this.subscribe("updateShortMessage", processUpdateShortMessage)
        this.subscribe("updateShortChatMessage", processUpdateShortChatMessage)
        this.subscribe("updateNewMessage", processUpdateNewMessage)
        this.subscribe("updateDeleteChannelMessages", processUpdateDeleteChannelMessages)
        this.subscribe("updateDeleteMessages", processUpdateDeleteMessages)
        this.subscribe("updateEditMessage", processUpdateEditMessage)
        this.subscribe("updateMessagePoll", processUpdateMessagePoll)
        this.subscribe("updateEditChannelMessage", processUpdateEditChannelMessage)
        this.subscribe("updateNewChannelMessage", processUpdateNewChannelMessage)
        this.subscribe("updateDraftMessage", processUpdateDraftMessage)

        this.customUpdatesProcessors = new Map([
            ["updatesTooLong", processUpdatesTooLong],
            ["updateShortMessage", processShortMessage],
            ["updateShortChatMessage", processShortMessage],
            ["updateShort", processShort],
            ["updatesCombined", processUpdatesCombined],
            ["updates", processUpdates],
            ["updateShortSentMessage", processShortSentMessage],
            ["new_session_created", process_new_session_created],
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

        setTimeout(() => this.init(), 1000)

        return MTProto.invokeMethod("updates.getState", {}).then(state => {
            if (this._inited) {
                return
            }

            this.State = state
            this._inited = true

            if (this.updateStatusCheckingIntervalId === undefined) {
                this.updateStatusCheckingIntervalId = setInterval(() => {
                    if (this.channelUpdatesProcessor.isWaitingForDifference && (this.channelUpdatesProcessor.latestDifferenceTime + 2) <= MTProto.TimeManager.now(true)) {
                        AppEvents.General.fire("waitingForDifference", {
                            diffType: 0 // channel
                        })
                    }

                    if (this.defaultUpdatesProcessor.isWaitingForDifference && (this.defaultUpdatesProcessor.latestDifferenceTime + 2) <= MTProto.TimeManager.now(true)) {
                        AppEvents.General.fire("waitingForDifference", {
                            diffType: 1 // default
                        })
                    }

                    // if (this.defaultUpdatesProcessor.isWaitingForDifference && (this.channelUpdatesProcessor.latestDifferenceTime + 5) <= MTProto.TimeManager.now(true) && AppConnectionStatus.Status !== AppConnectionStatus.WAITING_FOR_NETWORK) {
                    //     this.channelUpdatesProcessor.isWaitingForDifference = true
                    //     this.channelUpdatesProcessor.queueIsProcessing = false
                    //     this.channelUpdatesProcessor.latestDifferenceTime = MTProto.TimeManager.now(true)
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

                    if (this.defaultUpdatesProcessor.isWaitingForDifference && (this.defaultUpdatesProcessor.latestDifferenceTime + 5) <= MTProto.TimeManager.now(true) && AppConnectionStatus.Status !== AppConnectionStatus.WAITING_FOR_NETWORK) {
                        this.defaultUpdatesProcessor.isWaitingForDifference = true
                        this.defaultUpdatesProcessor.queueIsProcessing = false
                        this.defaultUpdatesProcessor.latestDifferenceTime = MTProto.TimeManager.now(true)
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
        if (!this._inited) {
            return
        }
        if (this.updateListeners.has(rawUpdate._)) {
            this.updateListeners.get(rawUpdate._).forEach(listener => {
                listener(rawUpdate)
            })
        } else {
            // console.warn("unexpected update = ", rawUpdate._, rawUpdate)
        }
    }

    processUpdate(type, rawUpdate) {
        if (!this._inited) {
            return
        }
        if (this.channelUpdatesProcessor.updateTypes.includes(rawUpdate._)) {
            this.channelUpdatesProcessor.enqueue(rawUpdate)
        } else {
            this.defaultUpdatesProcessor.enqueue(rawUpdate)
        }
    }

    process(rawUpdate) {
        if (!this._inited) {
            return
        }
        if (this.customUpdatesProcessors.has(rawUpdate._)) {
            this.customUpdatesProcessors.get(rawUpdate._)(this, rawUpdate)
        } else {
            if (rawUpdate.update) {
                this.processUpdate(rawUpdate.update._, rawUpdate.update)
            } else if (rawUpdate._) {
                console.warn("unexpected update = ", rawUpdate)
                this.processUpdate(rawUpdate._, rawUpdate)
            } else {
                console.warn("unexpected update = ", rawUpdate)
            }
        }
    }
}

const UpdatesManager = new UpdateManager()

export default UpdatesManager