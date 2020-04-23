/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Manager} from "../Manager";
import PeersStore from "../Store/PeersStore"
import PeerFactory from "./PeerFactory"

class PeerManager extends Manager {

    constructor() {
        super()
    }

    init() {
        if (this._inited) {
            return Promise.resolve()
        }

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