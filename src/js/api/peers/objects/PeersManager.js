import {Manager} from "../../manager";
import PeersStore from "../../store/PeersStore"
import {MTProto} from "../../../mtproto/external"
import {UserPeer} from "./UserPeer"
import PeerFactory from "../PeerFactory"
import {GroupPeer} from "./GroupPeer";
import {ChannelPeer} from "./ChannelPeer";
import {SupergroupPeer} from "./SupergroupPeer";

class PeerManager extends Manager {

    constructor() {
        super()
    }

    init() {
        if (this._inited) {
            return Promise.resolve()
        }

        MTProto.UpdatesManager.subscribe("updateUserStatus", update => {
            const peer = PeersStore.get("user", update.user_id)

            if (peer instanceof UserPeer) {
                peer.status = update.status
                // peer.raw.status.expires = tsNow(true) + 2

            }
        })

        MTProto.UpdatesManager.subscribe("updateUserPhoto", update => {
            const peer = PeersStore.get("user", update.user_id)

            if (peer instanceof UserPeer) {
                peer.photo.fillRaw(update.photo)
            }
        })

        MTProto.UpdatesManager.subscribe("updateUserPinnedMessage", update => {
            const peer = PeersStore.get("user", update.user_id)

            if (peer instanceof UserPeer) {
                peer.pinnedMessageId = update.id
            }
        })

        MTProto.UpdatesManager.subscribe("updateChatPinnedMessage", update => {
            const peer = PeersStore.get("chat", update.chat_id)

            if (peer instanceof GroupPeer) {
                peer.pinnedMessageId = update.id
            }
        })

        MTProto.UpdatesManager.subscribe("updateChannelPinnedMessage", update => {
            const peer = PeersStore.get("channel", update.channel_id)

            if (peer instanceof ChannelPeer || peer instanceof SupergroupPeer) {
                peer.pinnedMessageId = update.id
            }
        })

        MTProto.UpdatesManager.subscribe("updateNotifySettings", update => {
            if (update.peer._ === "notifyPeer") {
                let peer
                if (update.peer.peer._ === "peerUser") {
                    peer = PeersStore.get("user", update.peer.peer.user_id)
                } else if (update.peer.peer._ === "peerChat") {
                    peer = PeersStore.get("chat", update.peer.peer.chat_id)
                } else if (update.peer.peer._ === "peerChannel") {
                    peer = PeersStore.get("channel", update.peer.peer.channel_id)
                }

                if (peer && peer.full) {
                    peer.full.notify_settings = update.notify_settings
                    peer.fire("updateNotificationStatus", {
                        notifySettings: update.notify_settings
                    })
                }
            }

        })

        this._inited = true
    }

    _findMessageByUser(messages, peer) {
        return messages.find(Message => {
            return (
                Message.chat_id === peer.id ||
                Message.user_id === peer.id ||
                Message.from_id === peer.id || (
                    Message.to_id && (
                        Message.user_id === peer.id
                    )
                )
            )
        })
    }

    _findMessageByChat(messages, peer) {
        return messages.find(Message => {
            return (
                Message.user_id === peer.id ||
                Message.chat_id === peer.id ||
                Message.from_id === peer.id || (
                    Message.to_id && (
                        Message.chat_id === peer.id
                    )
                )
            )
        })
    }

    fillPeersFromUpdate(rawUpdate) {
        const data = {
            users: [],
            chats: [],
        }

        if (rawUpdate.users) {
            data.users = rawUpdate.users.map(rawUser => {
                if (rawUser._ === "userEmpty") {
                    console.warn("empty", rawUser)
                }

                const peer = PeersManager.setFromRaw(rawUser)

                if (peer.isMin) {
                    const messages = rawUpdate.messages || rawUpdate.new_messages

                    if (messages) {
                        const Message = this._findMessageByUser(messages, peer)
                        if (Message) {
                            peer._min_inputPeer = Message.to_id
                        }
                    }
                }

                return peer
            })
        }

        if (rawUpdate.chats) {
            data.chats = rawUpdate.chats.map(rawChat => {
                const peer = PeersManager.setFromRaw(rawChat)

                if (peer.isMin) {
                    const messages = rawUpdate.messages || rawUpdate.new_messages

                    if (messages) {
                        const Message = this._findMessageByChat(messages, peer)
                        if (Message) {
                            peer._min_inputPeer = Message.to_id
                        }
                    }
                }

                return peer
            })
        }

        return data
    }

    setFromRaw(rawPeer) {
        if (PeersStore.has(rawPeer._, rawPeer.id)) {
            const peer = PeersStore.get(rawPeer._, rawPeer.id)
            peer.fillRaw(rawPeer)
            return peer
        } else {
            const peer = PeerFactory.fromRaw(rawPeer)
            PeersStore.set(peer)
            return peer
        }
    }

    setFromRawAndFire(rawPeer) {
        if (PeersStore.has(rawPeer._, rawPeer.id)) {
            const peer = PeersStore.get(rawPeer._, rawPeer.id)
            peer.fillRawAndFire(rawPeer)
            return peer
        } else {
            const peer = PeerFactory.fromRaw(rawPeer)
            PeersStore.set(peer)

            peer.fire("updateSingle", {
                peer
            })

            return peer
        }
    }
}

const PeersManager = new PeerManager()

export default PeersManager