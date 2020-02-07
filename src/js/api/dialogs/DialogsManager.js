import {MTProto} from "../../mtproto/external"
import {getInputPeerFromPeer, getInputPeerFromPeerWithoutAccessHash, getPeerTypeFromType} from "./util"
import TimeManager from "../../mtproto/timeManager"
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

        AppSelectedPeer.subscribe(_ => {
            if (AppSelectedPeer.Previous) {
                AppSelectedPeer.Previous.dialog.peer.messages.clear()
            }
        })

        MTProto.UpdatesManager.subscribe("updateDialogPinned", async update => {
            const peerType = getPeerTypeFromType(update.peer.peer._)
            const dialog = await this.findOrFetch(peerType, update.peer.peer[`${peerType}_id`])

            if (!dialog) return

            dialog.pinned = update.pFlags.pinned || false
        })


        MTProto.UpdatesManager.subscribe("updateChannel", async update => {
            // await this.findOrFetch("channel", update.channel_id)
            console.warn("updateChannel", update)
        })

        MTProto.UpdatesManager.subscribe("updateChannelNoPeer", async update => {
            console.warn("updateChannelNoPeer NO WAY AAAAAAAAAAAAAAA", update)
        })

        MTProto.UpdatesManager.subscribe("updateChannelNoDialog", async update => {
            console.warn("updateChannelNoDialog", update)
            // await this.findOrFetch("channel", update.channel_id)
        })

        MTProto.UpdatesManager.subscribe("updateNewChannelMessageNoPeer", async update => {
            console.warn("updateNewChannelMessageNoPeer NO WAY AAAAAAAAAAAAAAA", update)
        })

        MTProto.UpdatesManager.subscribe("updateNewChannelMessageNoDialog", async update => {
            console.warn("updateNewChannelMessageNoDialog", update)
            // await this.findOrFetch("channel", update.channel_id)
        })

        MTProto.UpdatesManager.subscribe("updateReadHistoryInbox", update => {
            const dialog = this.findByPeer(update.peer)

            if (dialog) {
                dialog.peer.messages.readInboxMaxId = update.max_id

                if (update.still_unread_count === 0) {
                    dialog.peer.messages.clearUnread()
                } else {
                    dialog.peer.messages.unreadCount = update.still_unread_count
                    dialog.peer.messages.clearUnreadIds()
                }
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
                dialog.peer.messages.startTransaction()
                dialog.peer.messages.readInboxMaxId = update.max_id
                if (update.still_unread_count === 0) {
                    dialog.peer.messages.clearUnread()
                } else {
                    dialog.peer.messages.unreadCount = update.still_unread_count
                    dialog.peer.messages.clearUnreadIds()
                }
                dialog.peer.messages.stopTransaction()

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
                    dialog = await this.getPeerDialogs(peer)
                }

                DialogsStore.set(dialog)
            } else {
                dialog = await this.getPeerDialogs({_: type, id})
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
            return Dialogs.dialogs.map(Dialog => this.createDialogFromDialogs(Dialog, Dialogs))[0]
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
        dialog.peer.messages.last = MessageFactory.fromRaw(dialog, rawTopMessage)
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
            this.offsetDate = this.dialogsOffsetDate + TimeManager.timeOffset
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

            AppEvents.Dialogs.fire("nextPage", {
                dialogs,
            })

            return dialogs
        })
    }

    fetchFirstPage() {
        if (this.isFetched) {
            AppEvents.Dialogs.fire("firstPage", {
                dialogs: DialogsStore.toSortedArray(),
            })

            return Promise.resolve(DialogsStore.toSortedArray())
        }

        return this.getDialogs().then(dialogs => {
            this.isFetched = true

            AppEvents.Dialogs.fire("firstPage", {
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