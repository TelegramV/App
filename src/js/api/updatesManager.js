import {Manager} from "./manager";
import MTProto from "../mtproto";
import {createLogger} from "../common/logger";
import {default as PeersManager} from "./peers/peersManager";
import {default as DialogsManager} from "./dialogs/dialogsManager";
import {getPeerObject} from "../dataObjects/peerFactory";
import {Message} from "../dataObjects/message";
import {getInputFromPeer, getInputPeerFromPeer} from "./dialogs/util";
import {Dialog} from "../dataObjects/dialog"

const Logger = createLogger("UpdateManager")

class UpdateManager extends Manager {
    constructor() {
        super()
        this._State = {}
        this.updateListeners = new Map() // Map<string, Array>
    }

    get State() {
        return this._State
    }

    set State(State) {
        this._State = State
        console.log("State was set = ", State)
    }

    init() {
        // return
        // MTProto.MessageProcessor.listenUpdateShort(this.handleShort.bind(this))
        // MTProto.MessageProcessor.listenUpdateShortMessage(this.handleShortMessage.bind(this))
        // MTProto.MessageProcessor.listenUpdateShortChatMessage(this.handleShortChatMessage.bind(this))
        // MTProto.MessageProcessor.listenUpdateShortSentMessage(this.handleShortSentMessage.bind(this))
        // MTProto.MessageProcessor.listenUpdates(this.handle.bind(this))
        // MTProto.MessageProcessor.listenUpdatesCombined(this.handleCombined.bind(this))

        // MTProto.invokeMethod("updates.getState", {}).then(l => {
        //     Logger.warn("State", l)
        //     this.state = l
        // })
    }

    listenUpdate(type, listener) {
        let listeners = this.updateListeners.get(type)
        if (!listeners) {
            listeners = this.updateListeners.set(type, []).get(type)
        }
        listeners.push(listener)
        console.log("listening", type, listeners)
    }

    processUpdate(type, update) {
        if (this.updateListeners.has(type)) {
            if (update._ === "updateNewChannelMessage" && update.hasOwnProperty("pts_count")) {
                const dialog = DialogsManager.find("channel", update.message.to_id.channel_id)

                if ((dialog.dialog.pts + update.pts_count) === update.pts) {
                    console.log("update can be processed")
                    dialog.dialog.pts = update.pts

                    this.updateListeners.get(type).forEach(l => {
                        l(update)
                    })
                } else if ((dialog.dialog.pts + update.pts_count) > update.pts) {
                    console.log("update already processed")
                } else {
                    console.warn("update cannot be processed", update, dialog.dialog.pts, update.pts_count, update.pts)

                    this.getChannelDifference(getInputFromPeer("channel", update.message.to_id.channel_id, dialog.peer.peer.access_hash)).then(() => {
                        this.updateListeners.get(type).forEach(l => {
                            l(update)
                        })
                    })
                }
            } else {
                this.updateListeners.get(type).forEach(l => {
                    l(update)
                })
            }

        } else {
            Logger.warn("unexpected update = ", type, update)
        }
    }

    process(message) {

        if (message._ === "updates") {
            message.users.forEach(user => PeersManager.set(getPeerObject(user)))
            message.chats.forEach(chat => PeersManager.set(getPeerObject(chat)))

            message.updates.forEach(update => {
                this.processUpdate(update._, update)
            })
        } else {
            if (this.updateListeners.has(message._)) {
                this.processUpdate(message._, message)
            } else {
                Logger.warn("unexpected message = ", message)
            }
        }

    }

    getDifference() {
        MTProto.invokeMethod("updates.getDifference", {
            pts: this.State.pts,
            date: this.State.date,
            qts: this.State.qts,
            flags: 0
        }).then(l => {
            Logger.warn("Difference", l)
        })
    }

    getChannelDifference(channel) {
        return MTProto.invokeMethod("updates.getChannelDifference", {
            flags: 0,
            force: false,
            channel: channel,
            filter: {
                "_": "channelMessagesFilterEmpty"
            },
            pts: this.State.pts,
            limit: 10,
        }).then(difference => {
            console.log("ChannelDifference", difference)

            difference.users.forEach(user => PeersManager.set(getPeerObject(user)))
            difference.chats.forEach(chat => PeersManager.set(getPeerObject(chat)))

            const dialog = difference.dialog

            const keys = {
                peerUser: "user_id",
                peerChannel: "channel_id",
                peerChat: "chat_id"
            }
            const key = keys[dialog.peer._]
            const peer = (dialog.peer._ === "peerUser" ? difference.users : difference.chats).find(l => l.id === dialog.peer[key])
            const lastMessage = difference.messages.find(l => l.id === dialog.top_message)
            DialogsManager.offsetDate = lastMessage.date
            if (this.offsetDate && !dialog.pFlags.pinned && (!DialogsManager.dialogsOffsetDate || DialogsManager.offsetDate < DialogsManager.dialogsOffsetDate)) {
                DialogsManager.dialogsOffsetDate = DialogsManager.offsetDate
            }
            const p = getPeerObject(peer)
            PeersManager.set(p)

            const d = new Dialog(dialog, p, lastMessage)
            
            DialogsManager.dialogs[d.type][d.id] = d


            this.resolveListeners({
                type: "updateSingle",
                dialog: d,
            })

            d.peer.getAvatar()

            return difference
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