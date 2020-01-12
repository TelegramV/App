import {Manager} from "./manager";
import MTProto from "../mtproto";
import {createLogger} from "../common/logger";
import {default as PeersManager} from "./peers/peersManager";
import {default as DialogsManager} from "./dialogs/dialogsManager";
import {getPeerObject} from "../dataObjects/peerFactory";
import {Message} from "../dataObjects/message";
import {getInputFromPeer, getInputPeerFromPeer} from "./dialogs/util";

const Logger = createLogger("UpdateManager")

class UpdateManager extends Manager {
    constructor() {
        super()
        this._State = {}
        this.updateListeners = new Map() // Map<string, Array>

        this._channelUpdateTypes = [
            "updateNewChannelMessage",
            "updateEditChannelMessage",
            "updateDeleteChannelMessages",
            "updates.channelDifference",
            "updates.channelDifferenceTooLong",
        ]

        this._channelStack = []
        this._channelStackResolving = false

        this._userStack = []
        this._userStackResolving = false
    }

    get State() {
        return this._State
    }

    set State(State) {
        this._State = State
        console.log("State was set = ", State)
    }

    init() {
        MTProto.invokeMethod("updates.getState", {}).then(State => {
            this.State = State
        })
    }

    listenUpdate(type, listener) {
        let listeners = this.updateListeners.get(type)
        if (!listeners) {
            listeners = this.updateListeners.set(type, []).get(type)
        }
        listeners.push(listener)
        console.log("listening", type, listeners)
    }

    resolveUpdateListeners(update) {

        if (this.updateListeners.has(update._)) {
            this.updateListeners.get(update._).forEach(l => {
                l(update)
            })
        } else {
            Logger.warn("unexpected update = ", update._, update)
        }
    }

    processUpdate(type, update) {
        if (this._channelUpdateTypes.includes(update._)) {
            this.pushToChannelStack(update)
        } else {
            this.pushToUserStack(update)
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

    getDifference(onTooLong = undefined) {
        MTProto.invokeMethod("updates.getDifference", {
            pts: this.State.pts,
            date: this.State.date,
            qts: this.State.qts,
            flags: 0
        }).then(_difference => {
            if (onTooLong && _difference._ === "updates.differenceTooLong") {
                onTooLong(_difference)
            } else {
                this.pushToUserStack(_difference)
            }

            return _difference
        })
    }

    getChannelDifference(channel, pts, onTooLong = undefined) {
        return MTProto.invokeMethod("updates.getChannelDifference", {
            flags: 0,
            force: false,
            channel: channel,
            filter: {
                "_": "channelMessagesFilterEmpty"
            },
            pts: pts,
            limit: 10,
        }).then(_difference => {
            _difference.__channel = channel

            if (onTooLong && _difference._ === "updates.channelDifferenceTooLong") {
                onTooLong(_difference)
            } else {
                this.pushToChannelStack(_difference)
            }

            return _difference
        })
    }

    pushToChannelStack(_update) {
        this._channelStack.push(_update)

        if (!this._channelStackResolving) {
            this.resolveChannelStack()
        }
    }

    pushToUserStack(_update) {
        this._userStack.push(_update)

        if (!this._userStackResolving) {
            this.resolveUserStack()
        }
    }

    _checkChannelPts(dialog, _update, onFail) {
        if ((dialog.dialog.pts + _update.pts_count) === _update.pts) {
            console.log("channel update can be processed", _update)

            this.resolveUpdateListeners(_update)

            dialog.dialog.pts = _update.pts
        } else if ((dialog.dialog.pts + _update.pts_count) > _update.pts) {
            console.log("channel update already processed")
        } else {
            console.warn("channel update cannot be processed", _update, dialog.dialog.pts, _update.pts_count, _update.pts)
            onFail()
        }
    }

    _checkUserPts(_update, onFail) {
        if ((this.State.pts + _update.pts_count) === _update.pts) {
            console.log("update can be processed", _update)

            this.State.pts = _update.pts

            this.resolveUpdateListeners(_update)

        } else if ((this.State.pts + _update.pts_count) > _update.pts) {
            console.log("update already processed")
        } else {
            console.warn("update cannot be processed", _update, this.State.pts, _update.pts_count, _update.pts)
            onFail()
        }
    }

    _processChannelMessageUpdate(update) {
        let channelId = undefined

        if (update._ === "updateNewChannelMessage") {
            channelId = update.message.to_id.channel_id
        } else if (update._ === "updateEditChannelMessage") {
            channelId = update.message.to_id.channel_id
        } else if (update._ === "updateDeleteChannelMessage") {
            channelId = update.channel_id
        } else {
            console.warn("ignoring", update)
            return
        }

        const dialog = DialogsManager.find("channel", update.message.to_id.channel_id)

        if (dialog) {
            this._checkChannelPts(dialog, update, () => {
                this.getChannelDifference(getInputFromPeer("channel", channelId, dialog.peer.peer.access_hash), dialog.dialog.pts)
            })
        } else {
            console.error("dialog wasn't found!", update)

            // let peer = undefined
            //
            // // if (update.message.pFlags.out) {
            // //     peer = getInputPeerFromPeer("user", MTProto.getAuthorizedUser().user.id)
            // // } else {
            // const peerName = getPeerNameFromType(update.message.to_id._)
            // peer = getInputPeerFromPeer(peerName, update.message.to_id.channel_id)
            // // }
            //
            // this.getChannelDifference({
            //     // _: "inputChannelFromMessage",
            //     _: "inputChannel",
            //     channel_id: update.message.to_id.channel_id,
            //     // msg_id: update.message.id,
            //     // peer,
            // }, update.pts + update.pts_count, _differenceTooLong => {
            //     DialogsManager.resolveDialogWithSlice(_differenceTooLong.dialog, _differenceTooLong, {
            //         dispatchEvent: true
            //     })
            // })
        }
    }

    _processUserMessageUpdate(update) {
        this._checkUserPts(update, () => {
            this.getDifference()
        })
    }

    resolveChannelStack() {
        if (this._channelStack.length > 0 && !this._channelStackResolving) {
            this._channelStackResolving = true

            try {
                const update = this._channelStack[0]

                if (update._.endsWith("ChannelMessage")) {
                    this._processChannelMessageUpdate(update)
                } else if (update._ === "updates.channelDifference") {
                    update.users.forEach(user => PeersManager.set(getPeerObject(user)))
                    update.chats.forEach(chat => PeersManager.set(getPeerObject(chat)))

                    update.new_messages.forEach(message => {
                        this.resolveUpdateListeners({
                            _: "updateNewChannelMessage",
                            message
                        })
                    })

                    update.other_updates.forEach(ou => {
                        this.resolveUpdateListeners(ou)
                    })

                    const dialog = DialogsManager.find("channel", update.__channel.channel_id)

                    dialog.dialog.pts = update.pts

                } else if (update._ === "updates.channelDifferenceTooLong") {
                    location.reload()
                } else if (update._ === "updates.channelDifferenceEmpty") {
                    const dialog = DialogsManager.find("channel", update.__channel.channel_id)
                    dialog.dialog.pts = update.pts
                } else {
                    this.resolveUpdateListeners(update)
                }

                this._channelStack.shift()

                this._channelStackResolving = false

                this.resolveChannelStack()
            } catch
                (e) {
                console.error(e)
                this._channelStack.shift()

                this._channelStackResolving = false

                this.resolveChannelStack()
            }
        }
    }

    resolveUserStack() {
        if (this._userStack.length > 0 && !this._userStackResolving) {
            this._userStackResolving = true

            try {
                const update = this._userStack[0]

                if (update._.endsWith("Message")) {
                    console.warn("message update", update)
                    this._processUserMessageUpdate(update)
                } else if (update._ === "updates.difference") {
                    update.chats.forEach(chat => PeersManager.set(getPeerObject(chat)))
                    update.users.forEach(user => PeersManager.set(getPeerObject(user)))

                    update.new_messages.forEach(message => {
                        this.resolveUpdateListeners({
                            _: "updateNewMessage",
                            message
                        })
                    })

                    // todo: handle encrypted messages

                    update.other_updates.forEach(ou => {
                        this.resolveUpdateListeners(ou)
                    })

                    this.State = update.state

                } else if (update._ === "updates.differenceSlice") {
                    update.chats.forEach(chat => PeersManager.set(getPeerObject(chat)))
                    update.users.forEach(user => PeersManager.set(getPeerObject(user)))

                    update.new_messages.forEach(message => {
                        this.resolveUpdateListeners({
                            _: "updateNewMessage",
                            message
                        })
                    })

                    // todo: handle encrypted messages

                    update.other_updates.forEach(ou => {
                        this.resolveUpdateListeners(ou)
                    })

                    this.State = update.intermediate_state // todo: handle it

                } else if (update._ === "updates.differenceTooLong") {
                    location.reload()
                } else if (update._ === "updates.differenceEmpty") {
                    this.State.seq = update.seq
                    this.State.date = update.date
                } else {
                    this.resolveUpdateListeners(update)
                }

                this._userStack.shift()

                this._userStackResolving = false

                this.resolveUserStack()
            } catch
                (e) {
                console.error(e)
                this._userStack.shift()

                this._userStackResolving = false

                this.resolveUserStack()
            }
        }
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