import {getInputPeerFromPeer, getInputPeerFromPeerWithoutAccessHash} from "./util"
import {Dialog} from "./Dialog";
import {Manager} from "../manager";
import {Peer} from "../peers/objects/Peer";
import {PeerAPI} from "../peerAPI"
import DialogsStore from "../store/DialogsStore"
import AppEvents from "../eventBus/AppEvents"
import PeersStore from "../store/PeersStore"
import AppSelectedPeer from "../../ui/reactive/SelectedPeer"
import {MessageFactory} from "../messages/MessageFactory"
import API from "../telegram/API"
import PeersManager from "../peers/objects/PeersManager"
import MTProto from "../../mtproto/external"

class DialogManager extends Manager {
    constructor() {
        super()

        this.allWasFetched = false

        this.latestDialog = undefined
        this.dialogsOffsetDate = 0 // TODO
        this.offsetDate = 0
        this.count = undefined

        this.isFetched = false
    }

    init() {
        if (this._inited) {
            return Promise.resolve()
        }

        // actions checking interval
        // very dirty thing, but fuck, no time left
        setInterval(() => {
            DialogsStore.toArray().forEach(dialog => {
                dialog.actions.forEach(rawUpdate => {
                    if (rawUpdate.time + 5 <= MTProto.TimeManager.now(true)) {
                        dialog.removeAction(rawUpdate)
                    }
                })
            })
        }, 3000)

        AppSelectedPeer.subscribe(_ => {
            if (AppSelectedPeer.Previous) {
                AppSelectedPeer.Previous.messages.clear()
            }
        })

        MTProto.UpdatesManager.subscribe("updates.channelDifferenceTooLong", rawDifferenceWithPeer => {
            PeersManager.fillPeersFromUpdate(rawDifferenceWithPeer)

            rawDifferenceWithPeer.__peer.dialog.fillRaw(rawDifferenceWithPeer.dialog)

            rawDifferenceWithPeer.messages = rawDifferenceWithPeer.messages.map(m => MessageFactory.fromRaw(rawDifferenceWithPeer.__peer, m))
            rawDifferenceWithPeer.__peer.messages.appendMany(rawDifferenceWithPeer.messages)

            AppEvents.Dialogs.fire("ChannelRefreshCausedByDifferenceTooLong", {
                dialog: rawDifferenceWithPeer.__peer.dialog
            })
        })

        MTProto.UpdatesManager.subscribe("updateChatUserTyping", update => {
            let peer = PeersStore.get("chat", update.chat_id) || PeersStore.get("channel", update.chat_id)

            if (!peer || !peer.dialog) {
                console.log("good game telegram, good game")
            } else {
                update.time = MTProto.TimeManager.now(true)
                peer.dialog.addAction(update)
            }
        })


        MTProto.UpdatesManager.subscribe("updateUserTyping", update => {
            let peer = PeersStore.get("user", update.user_id)

            if (!peer || !peer.dialog) {
                console.log("good game telegram, good game")
            } else {
                update.time = MTProto.TimeManager.now(true)
                peer.dialog.addAction(update)
            }
        })

        MTProto.UpdatesManager.subscribe("updateDialogPinned", async update => {
            const peer = PeersStore.getByPeerType(update.peer.peer)

            if (!peer) {
                console.error("BUG: no way telegram, no way")
            }

            if (!peer.dialog) {
                this.getPeerDialogs(peer).then(dialogs => {
                    AppEvents.Dialogs.fire("gotNewMany", {
                        dialogs
                    })
                })

                return
            }

            peer.dialog.pinned = update.pFlags.pinned || false
        })


        MTProto.UpdatesManager.subscribe("updateChannelNoPeer", async update => {
            console.warn("updateChannelNoPeer NO WAY AAAAAAAAAAAAAAA", update)
        })

        MTProto.UpdatesManager.subscribe("updateNewChannelMessageNoPeer", async update => {
            console.warn("updateNewChannelMessageNoPeer NO WAY AAAAAAAAAAAAAAA", update)
        })


        MTProto.UpdatesManager.subscribe("updateChannel", async update => {
            // await this.findOrFetch("channel", update.channel_id)
            console.warn("updateChannel", update)

            this.getPeerDialogs(update.__peer).then(dialogs => {
                AppEvents.Dialogs.fire("gotNewMany", {
                    dialogs
                })
            })
        })

        MTProto.UpdatesManager.subscribe("updateChannelNoDialog", async update => {
            console.warn("updateChannelNoDialog", update)

            this.getPeerDialogs(update.__peer).then(dialogs => {
                AppEvents.Dialogs.fire("gotNewMany", {
                    dialogs
                })
            })
            // await this.findOrFetch("channel", update.channel_id)
        })

        MTProto.UpdatesManager.subscribe("updateNewChannelMessageNoDialog", update => {
            console.warn("updateNewChannelMessageNoDialog", update)

            this.getPeerDialogs(update.__peer).then(dialogs => {
                AppEvents.Dialogs.fire("gotNewMany", {
                    dialogs
                })
            })
        })

        MTProto.UpdatesManager.subscribe("updateReadHistoryInbox", update => {
            const dialog = this.findByPeer(update.peer)

            if (dialog) {
                dialog.peer.messages.readInboxMaxId = update.max_id
            }
        })

        MTProto.UpdatesManager.subscribe("updateReadHistoryOutbox", update => {
            const dialog = this.findByPeer(update.peer)
            if (dialog) {
                dialog.peer.messages.readOutboxMaxId = update.max_id
            }
        })

        MTProto.UpdatesManager.subscribe("updateReadChannelInbox", update => {
            const dialog = this.find("channel", update.channel_id)

            if (dialog) {
                dialog.peer.messages.readInboxMaxId = update.max_id
                dialog.fire("updateReadChannelInbox")
            }
        })

        MTProto.UpdatesManager.subscribe("updateReadChannelOutbox", update => {
            const dialog = this.find("channel", update.channel_id)

            if (dialog) {
                dialog.peer.messages.readOutboxMaxId = update.max_id
                dialog.fire("updateReadChannelOutbox")
            }
        })

        MTProto.UpdatesManager.subscribe("updateFolderPeers", update => {
            update.folder_peers.forEach(FolderPeer => {
                const dialog = this.findByPeer(FolderPeer.peer)

                if (dialog) {
                    dialog.folderId = FolderPeer.folder_id
                } else {
                    console.error("BUG: whoa!!! this thing is not implemented yet")
                }
            })
        })

        this._inited = true
    }

    /**
     * @param type
     * @param id
     * @return {Dialog|undefined}
     */
    find(type, id) {
        return DialogsStore.get(type, id)
    }

    /**
     * @param type
     * @param id
     * @return {Promise<Dialog|null>}
     */
    async findOrFetch(type, id) {
        console.log("fetch or find")

        let dialog = DialogsStore.get(type, id)

        if (!dialog) {
            let peer = PeersStore.get(type, id)

            if (peer) {
                dialog = peer.dialog

                if (!dialog) {
                    dialog = await this.getPeerDialogs(peer)[0]
                }

                DialogsStore.set(dialog)
            } else {
                dialog = await this.getPeerDialogs({_: type, id})[0]
                DialogsStore.set(dialog)
            }
        }

        return dialog
    }

    /**
     * @param peer
     * @return {Dialog}
     */
    findByPeer(peer) {
        if (peer instanceof Peer) {
            return DialogsStore.getByPeer(peer)
        }

        const plain = PeerAPI.getPlain(peer, false)

        return DialogsStore.get(plain._, plain.id)
    }

    getPeerDialogs(peer) {
        console.log(peer)

        const peerData = {
            _: "inputDialogPeer",
            peer: peer.inputPeer ? peer.inputPeer : !peer.access_hash ? getInputPeerFromPeerWithoutAccessHash(peer._, peer.id) : getInputPeerFromPeer(peer._, peer.id, peer.access_hash)
        }

        return API.messages.getPeerDialogs({
            peers: [peerData]
        }).then(Dialogs => {
            return Dialogs.dialogs.map(Dialog => this.createDialogFromDialogs(Dialog, Dialogs))
        })
    }

    /**
     * @param {Object} Dialog
     * @param {Object} Dialogs
     * @return {Dialog|undefined}
     */
    createDialogFromDialogs(Dialog, Dialogs) {
        const dialog = this.setFromRaw(Dialog)
        const rawTopMessage = Dialogs.messages.find(message => message.id === Dialog.top_message)
        dialog.peer.messages.last = MessageFactory.fromRaw(dialog.peer, rawTopMessage)
        return dialog
    }

    /**
     * @param params.limit
     * @param params.flags
     * @param params.exclude_pinned
     * @param params.folder_id
     * @param params.offset_date
     * @param params.offset_id
     * @param params.offset_peer
     * @param params.hash
     * @return {Promise<Dialog>}
     */
    getDialogs(params = {}) {

        params.offset_date = params.offset_date || this.offsetDate

        if (DialogsStore.count >= this.count) {
            console.warn("all dialogs were fetched")
        }

        if (this.dialogsOffsetDate) {
            this.offsetDate = this.dialogsOffsetDate
        }

        return API.messages.getDialogs(params).then(Dialogs => {

            if (Dialogs.count < Dialogs.__limit) {
                this.allWasFetched = true
            }

            if (Dialogs.count) {
                this.count = Dialogs.count
            }

            const dialogs = Dialogs.dialogs.map(rawDialog => {
                const dialog = this.createDialogFromDialogs(rawDialog, Dialogs)

                if (dialog.peer.messages.last) {
                    this.offsetDate = dialog.peer.messages.last.date
                } else {
                    console.error("BUG: no last message!")
                }

                if (this.offsetDate && !dialog.pinned && (!this.dialogsOffsetDate || this.offsetDate < this.dialogsOffsetDate)) {
                    this.dialogsOffsetDate = this.offsetDate
                }

                return dialog
            })

            this.latestDialog = dialogs[dialogs.length - 1]

            return dialogs
        })
    }

    fetchArchivedDialogs() {
        return API.messages.getDialogs({
            flags: 1,
            folder_id: 1,
            limit: 100
        }).then(Dialogs => {
            const dialogs = Dialogs.dialogs.map(rawDialog => {
                return this.createDialogFromDialogs(rawDialog, Dialogs)
            })

            AppEvents.Dialogs.fire("gotArchived", {
                dialogs,
            })

            return dialogs
        })
    }

    fetchNextPage({limit = 40}) {
        if (this.allWasFetched || DialogsStore.count >= this.count) {
            console.warn("all dialogs were fetched")
            return Promise.reject()
        }

        return this.getDialogs({
            limit: limit,
            offset_peer: this.latestDialog.peer.inputPeer,
            exclude_pinned: true
        }).then(dialogs => {

            AppEvents.Dialogs.fire("gotMany", {
                dialogs,
            })

            return dialogs
        })
    }

    fetchFirstPage() {
        if (this.isFetched) {
            AppEvents.Dialogs.fire("gotMany", {
                dialogs: DialogsStore.toSortedArray(),
            })

            return Promise.resolve(DialogsStore.toSortedArray())
        }

        return this.getDialogs().then(dialogs => {
            this.isFetched = true

            AppEvents.Dialogs.fire("gotMany", {
                dialogs: dialogs,
            })

            return dialogs
        })
    }

    setFromRaw(rawDialog) {
        const plainPeer = PeerAPI.getPlain(rawDialog.peer, false)

        if (DialogsStore.has(plainPeer._, plainPeer.id)) {
            const dialog = DialogsStore.get(plainPeer._, plainPeer.id)
            dialog.fillRaw(rawDialog)
            return dialog
        } else {
            const dialog = new Dialog(rawDialog)
            DialogsStore.set(dialog)
            return dialog
        }
    }

    setFromRawAndFire(rawDialog) {
        const plainPeer = PeerAPI.getPlain(rawDialog.peer, false)

        if (DialogsStore.has(plainPeer._, plainPeer.id)) {
            const dialog = DialogsStore.get(plainPeer._, plainPeer.id)
            dialog.fillRawAndFire(rawDialog)
            return dialog
        } else {
            const dialog = new Dialog(rawDialog)
            DialogsStore.set(dialog)

            dialog.fire("updateSingle")

            return dialog
        }
    }
}

const DialogsManager = new DialogManager()

export default DialogsManager