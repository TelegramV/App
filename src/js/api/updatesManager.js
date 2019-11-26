import {Manager} from "./manager";
import MTProto from "../mtproto";
import {createLogger} from "../common/logger";
import {default as PeersManager} from "./peers/peersManager";
import {getPeerObject} from "../dataObjects/peerFactory";

const Logger = createLogger("UpdateManager")

class UpdateManager extends Manager {
    constructor() {
        super()
        this.state = {}
    }

    init() {
        // TODO not ready yet
        return;
        MTProto.MessageProcessor.listenUpdateShort(this.handleShort.bind(this))
        MTProto.MessageProcessor.listenUpdateShortMessage(this.handleShortMessage.bind(this))
        MTProto.MessageProcessor.listenUpdateShortChatMessage(this.handleShortChatMessage.bind(this))
        MTProto.MessageProcessor.listenUpdateShortSentMessage(this.handleShortSentMessage.bind(this))
        MTProto.MessageProcessor.listenUpdates(this.handle.bind(this))
        MTProto.MessageProcessor.listenUpdatesCombined(this.handleCombined.bind(this))

        MTProto.invokeMethod("updates.getState", {}).then(l => {
            Logger.warn("State", l)
            this.state = l
        })
    }

    getDifference() {
        MTProto.invokeMethod("updates.getDifference", {
            pts: this.state.pts,
            date: this.state.date,
            qts: this.state.qts,
            flags: 0
        }).then(l => {
            Logger.warn("Difference", l)
        })
    }

    handleShort(update) {
        switch (update._) {
            case "updateUserStatus":
                break
            default:
                Logger.debug("Unknown short", update._, update)
                break
        }
        // this.getDifference()
    }

    handleShortMessage(update) {
        Logger.debug("ShortMessage", update._)
    }

    handleShortChatMessage(update) {
        Logger.debug("ShortChatMessage", update._)
    }

    handleShortSentMessage(update) {
        Logger.debug("ShortSentMessage", update._)
    }

    handleCombined(update) {
        Logger.debug("Combined", update._)
    }

    handle(update) {
        console.log(update)

        const addedUsers = update.users.filter(l => {
            if(l.pFlags.min) {
                const msg = update.updates.filter(q => q.message && q.message.from_id === l.id)[0]
                PeersManager.set(getPeerObject(l, msg.message.id))
            } else {
                PeersManager.set(getPeerObject(l))
            }
        })
        const addedChats = update.chats.filter(l => {
            if(l.pFlags.min) {

                const msg = update.updates.filter(q => q.message && q.message.to_id && q.message.to_id.channel_id === l.id)[0]
                PeersManager.set(getPeerObject(l, msg.message.id))
            } else {
                PeersManager.set(getPeerObject(l))
            }
        })
        Logger.debug(`Update (+${addedUsers.length} users, +${addedChats.length} chats): `, update)
        update.updates.forEach(l => {
            switch (l._) {
                case "updateNewChannelMessage":

                    break
                default:
                    Logger.error(" unknown event ", l._, l)
                    break
            }
        })
    }
}

export default new UpdateManager()