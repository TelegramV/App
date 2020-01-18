import {Manager} from "../manager";
import MTProto from "../../mtproto";
import processUpdatesTooLong from "./processUpdatesTooLong"
import processShortMessage from "./processShortMessage"
import processShort from "./processShort"
import processUpdatesCombined from "./processUpdatesCombined"
import processUpdates from "./processUpdates"
import {ChannelUpdatesProcessor} from "./ChannelUpdatesProcessor"
import {DefaultUpdatesProcessor} from "./DefaultUpdatesProcessor"
import processShortSentMessage from "./processShortSentMessage"

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
        console.log("State was set = ", State)
    }

    init() {
        return MTProto.invokeMethod("updates.getState", {}).then(state => {
            this.State = state
        })
    }

    listenUpdate(type, listener) {
        console.log("listening", type, listeners)

        let listeners = this.updateListeners.get(type)

        if (!listeners) {
            listeners = this.updateListeners.set(type, []).get(type)
        }

        listeners.push(listener)
    }

    resolveUpdateListeners(rawUpdate) {
        if (this.updateListeners.has(rawUpdate._)) {
            this.updateListeners.get(rawUpdate._).forEach(l => {
                l(rawUpdate)
            })
        } else {
            console.warn("unexpected update = ", rawUpdate._, rawUpdate)
        }
    }

    processUpdate(type, rawUpdate) {
        if (this.channelUpdatesProcessor.updateTypes.includes(rawUpdate._) || this.channelUpdatesProcessor.differenceUpdateTypes.includes(rawUpdate._)) {
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

export default new UpdateManager()