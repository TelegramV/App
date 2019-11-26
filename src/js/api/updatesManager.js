import {Manager} from "./manager";
import MTProto from "../mtproto";
import {createLogger} from "../common/logger";
import {default as PeersManager} from "./peers/peersManager";
import {default as DialogsManager} from "./dialogs/dialogsManager";
import {getPeerObject} from "../dataObjects/peerFactory";
import {Peer} from "../dataObjects/peer";
import {Message} from "../dataObjects/message";
import {getInputPeerFromPeer} from "./dialogs/util";

const Logger = createLogger("UpdateManager")

class UpdateManager extends Manager {
    constructor() {
        super()
        this.state = {}
    }

    init() {
        return
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

    getChannel(id) {
        return PeersManager.find("channel", id)
    }

    getChannelDialog(id) {
        return DialogsManager.find("channel", id)
    }

    getChat(id) {
        return PeersManager.find("chat", id)
    }

    getChatDialog(id) {
        return DialogsManager.find("chat", id)
    }

    getUser(id) {
        return PeersManager.find("user", id)
    }

    getUserDialog(id) {
        return DialogsManager.find("user", id)
    }

    async loadDialog(type, id) {
        await this.loadDialogPeer(getInputPeerFromPeer(type, id))
    }

    async loadDialogPeer(peer) {
        await DialogsManager.fetchDialogs({
            limit: 1,
            offset_id: -1,
            offset_date: -1,
            offset_peer: peer
        })
    }

    async handleUpdate(update) {

        switch (update._) {
            case "updateUserStatus":
                break
            case "updateChatUserTyping":
                break
            case "updateMessagePoll":
                break

            case "updateDeleteChannelMessages":
                const channel = this.getChannel(update.channel_id)
                const messages = update.messages
                break

            case "updateShortMessage": {
                console.log("SHORT MESSAGE", update)
                const dialog = this.getUserDialog(update.user_id)
                if (!dialog) {
                    Logger.error("No dialog found", update.text, update)

                    await this.loadDialog("user", update.user_id)
                    return
                }
                const message = new Message(dialog, update)
                break
            }
            case "updateEditMessage":
            case "updateNewMessage":
            case "updateEditChannelMessage":
            case "updateNewChannelMessage": {
                const msg = update.message
                // console.log("msg", msg)
                const peer = update._ === "updateNewChannelMessage" || update._ === "updateEditChannelMessage" ?
                    update.message.to_id : (update.message.from ?
                    getInputPeerFromPeer("user", update.message.from) :
                    update.message.to_id)
                const dialog = DialogsManager.findByPeer(msg.to_id)
                // console.log(msg.message, dialog ? dialog.peer.peerName : "null",  msg.to_id)
                if (!dialog) {
                    Logger.error("No dialog found", msg.text, msg)
                    await this.loadDialogPeer(peer)
                    return
                }
                const message = new Message(dialog, msg)

                break
            }
            default:
                Logger.error("Unknown update", update._, update)
                break
        }
    }

    handleShort(update) {
        this.handleUpdate(update)
        // this.getDifference()
    }

    handleShortMessage(update) {
        this.handleUpdate(update)
    }

    handleShortChatMessage(update) {
        this.handleUpdate(update)
    }

    handleShortSentMessage(update) {
        this.handleUpdate(update)
    }

    handleCombined(update) {
        Logger.debug("Combined", update._)
    }

    handle(update) {
        const addedUsers = update.users.filter(l => {
            PeersManager.set(getPeerObject(l))
        })
        const addedChats = update.chats.filter(l => {
            PeersManager.set(getPeerObject(l))
        })
        // Logger.debug(`Update (+${addedUsers.length} users, +${addedChats.length} chats): `, update)
        update.updates.forEach(l => {
            this.handleUpdate(l)
        })
    }
}

export default new UpdateManager()