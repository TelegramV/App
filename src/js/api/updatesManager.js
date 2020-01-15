import {Manager} from "./manager";
import MTProto from "../mtproto";
import {createLogger} from "../common/logger";
import {default as PeersManager} from "./peers/peersManager";
import {default as DialogsManager} from "./dialogs/dialogsManager";
import {Message} from "./dataObjects/message";
import {getInputFromPeer, getInputPeerFromPeer} from "./dialogs/util";
import PeersStore from "./store/peersStore"
import DialogsStore from "./store/dialogsStore"

const Logger = createLogger("UpdateManager", {
    level: "log"
})

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

        this._channelQueue = []
        this._channelStackResolving = false

        this._userQueue = []
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
            message.users.forEach(user => PeersManager.setFromRawAndFire(user))
            message.chats.forEach(chat => PeersManager.setFromRawAndFire(chat))

            message.updates.forEach(update => {
                this.processUpdate(update._, update)
            })
        } else if (message._ === "updateShort") {
            this.processUpdate(message.update._, message.update)
        } else {
            if (this.updateListeners.has(message._)) {
                this.processUpdate(message._, message)
            } else {
                Logger.warn("unexpected message = ", message)
            }
        }

    }

    getDifference(State = {}, onTooLong = undefined) {
        MTProto.invokeMethod("updates.getDifference", {
            pts: State.pts || this.State.pts,
            date: State.date || this.State.date,
            qts: State.qts || this.State.qts,
            flags: 0
        }).then(_difference => {
            console.warn("Difference", _difference)

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
        this._channelQueue.push(_update)

        if (!this._channelStackResolving) {
            this.resolveChannelQueue()
        }
    }

    pushToUserStack(_update) {
        this._userQueue.push(_update)

        if (!this._userStackResolving) {
            this.resolveUserQueue()
        }
    }

    /**
     * @param {Dialog} dialog
     * @param _update
     * @param onFail
     * @private
     */
    _checkChannelPts(dialog, _update, onFail) {
        if ((dialog.pts + _update.pts_count) === _update.pts) {
            // console.log("channel update can be processed", _update)

            this.resolveUpdateListeners(_update)

            dialog.pts = _update.pts
        } else if ((dialog.pts + _update.pts_count) > _update.pts) {
            console.log("channel update already processed")
        } else {
            console.warn("channel update cannot be processed", _update, dialog.pts, _update.pts_count, _update.pts)
            onFail()
        }
    }

    _checkUserPts(State = {}, _update, onFail) {
        const statePts = State.pts || this.State.pts

        if ((statePts + _update.pts_count) === _update.pts) {
            this.State.pts = _update.pts

            this.resolveUpdateListeners(_update)

        } else if ((statePts + _update.pts_count) > _update.pts) {
            console.log("update already processed")
        } else {
            console.warn("update cannot be processed", _update, statePts, _update.pts_count, _update.pts)
            onFail()
        }
    }

    _processChannelMessageUpdate(update) {
        let channelId = undefined

        if (update._ === "updateNewChannelMessage") {
            channelId = update.message.to_id.channel_id
        } else if (update._ === "updateEditChannelMessage") {
            channelId = update.message.to_id.channel_id
        } else if (update._ === "updateDeleteChannelMessages") {
            channelId = update.channel_id
        } else {
            console.log("ignoring")
            return
        }

        const dialog = DialogsManager.find("channel", channelId)

        if (dialog) {
            this._checkChannelPts(dialog, update, () => {
                this.getChannelDifference(getInputFromPeer("channel", channelId, dialog.peer.peer.access_hash), dialog.pts)
            })
        } else {
            console.error("dialog wasn't found!", update)

            DialogsManager.findOrFetch("channel", channelId)

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
        this._checkUserPts({}, update, () => {
            this.getDifference({})
        })
    }

    _processChannelDifference(_difference) {
        console.warn("processing channel difference", _difference)

        const dialog = DialogsManager.find("channel", _difference.__channel.channel_id)

        if (dialog && dialog.pts > _difference.pts) {
            console.warn("looks like the channel difference is outdated")
        }

        if (_difference._ === "updates.channelDifference") {
            _difference.users.forEach(user => PeersManager.setFromRawAndFire(user))
            _difference.chats.forEach(chat => PeersManager.setFromRawAndFire(chat))

            _difference.new_messages.forEach(message => {
                this.resolveUpdateListeners({
                    _: "updateNewChannelMessage",
                    message
                })
            })

            _difference.other_updates.forEach(ou => {
                this.resolveUpdateListeners(ou)
            })

            dialog.pts = _difference.pts
        } else if (_difference._ === "updates.channelDifferenceTooLong") {
            location.reload()
        } else if (_difference._ === "updates.channelDifferenceEmpty") {
            dialog.pts = _difference.pts
        } else {
            this.resolveUpdateListeners(_difference)
        }
    }

    resolveChannelQueue(next = undefined) {
        if (this._channelQueue.length > 0 && !this._channelStackResolving) {
            this._channelStackResolving = true

            try {
                const update = next ? next : this._channelQueue[0]

                if (update._.endsWith("ChannelMessage") || update._.endsWith("ChannelMessages")) {

                    this._processChannelMessageUpdate(update)

                } else if (update._.startsWith("updates.channelDifference")) {

                    this._processChannelDifference(update)

                } else {
                    //todo: process other updates and set their pts
                    console.log("unprocessable update")
                }

                this._channelQueue.shift()

                this._channelStackResolving = false

                this.resolveChannelQueue()
            } catch
                (e) {
                console.error(e)
                this._channelQueue.shift()

                this._channelStackResolving = false

                this.resolveChannelQueue()
            }
        }
    }

    resolveUserQueue() {
        if (this._userQueue.length > 0 && !this._userStackResolving) {
            this._userStackResolving = true

            try {
                const update = this._userQueue[0]

                if (update._.endsWith("Message") || update._.endsWith("Messages")) {
                    // console.warn("message update", update)
                    this._processUserMessageUpdate(update)
                } else if (update._ === "updates.difference") {
                    update.chats.forEach(chat => PeersManager.setFromRawAndFire(chat))
                    update.users.forEach(user => PeersManager.setFromRawAndFire(user))

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
                    update.chats.forEach(chat => PeersManager.setFromRawAndFire(chat))
                    update.users.forEach(user => PeersManager.setFromRawAndFire(user))

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

                this._userQueue.shift()

                this._userStackResolving = false

                this.resolveUserQueue()
            } catch
                (e) {
                console.error(e)
                this._userQueue.shift()

                this._userStackResolving = false

                this.resolveUserQueue()
            }
        }
    }

    getChannel(id) {
        return PeersStore.get("channel", id)
    }

    getChannelDialog(id) {
        return DialogsStore.get("channel", id)
    }

    getChat(id) {
        return PeersStore.get("chat", id)
    }

    getChatDialog(id) {
        return DialogsStore.get("chat", id)
    }

    getUser(id) {
        return PeersStore.get("user", id)
    }

    getUserDialog(id) {
        return DialogsStore.get("user", id)
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
}

export default new UpdateManager()