import {getInputPeerFromPeer, getInputPeerFromPeerWithoutAccessHash} from "./util"
import {Dialog} from "./Dialog";
import {Manager} from "../Manager";
import {Peer} from "../Peers/Objects/Peer";
import {PeerParser} from "../Peers/PeerParser"
import DialogsStore from "../Store/DialogsStore"
import AppEvents from "../EventBus/AppEvents"
import PeersStore from "../Store/PeersStore"
import AppSelectedChat from "../../Ui/Reactive/SelectedChat"
import {MessageFactory} from "../Messages/MessageFactory"
import API from "../Telegram/API"
import PeersManager from "../Peers/Objects/PeersManager"
import MTProto from "../../MTProto/external"
import {UserPeer} from "../Peers/Objects/UserPeer"
import UIEvents from "../../Ui/EventBus/UIEvents"

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
            const now = MTProto.TimeManager.now(true)

            DialogsStore.toArray().forEach(dialog => {

                dialog.actions.forEach((action, peer) => {
                    if (action.time + 5 <= now) {
                        dialog.removeAction(peer)
                    }
                })

                if (dialog.peer instanceof UserPeer && dialog.peer.raw.status) {
                    if (dialog.peer.raw.status._ === "userStatusOnline" && dialog.peer.raw.status.expires < now) {
                        dialog.peer.status = {
                            _: "userStatusOffline",
                            was_online: dialog.peer.raw.status.expires
                        }
                    } else if (dialog.peer.raw.status._ === "userStatusOffline") {
                        if (!dialog.peer.raw.status._last_checked) {
                            dialog.peer.raw.status._last_checked = now
                            dialog.peer.fire("updateUserStatus")
                        } else if (dialog.peer.raw.status._last_checked + 59 < now) {
                            dialog.peer.raw.status._last_checked = now
                            dialog.peer.fire("updateUserStatus")
                        }
                    }
                }
            })
        }, 3000)

        UIEvents.General.subscribe("chat.select", _ => {
            if (AppSelectedChat.Previous) {
                AppSelectedChat.Previous.messages.clear()
            }
        })

        MTProto.UpdatesManager.subscribe("updates.channelDifferenceTooLong", rawDifferenceWithPeer => {
            PeersManager.fillPeersFromUpdate(rawDifferenceWithPeer)

            rawDifferenceWithPeer.__peer.dialog.fillRaw(rawDifferenceWithPeer.dialog)

            rawDifferenceWithPeer.messages = rawDifferenceWithPeer.messages.filter(m => m._ !== "messageEmpty").map(m => MessageFactory.fromRaw(rawDifferenceWithPeer.__peer, m))
            rawDifferenceWithPeer.__peer.messages.appendMany(rawDifferenceWithPeer.messages)

            AppEvents.Dialogs.fire("ChannelRefreshCausedByDifferenceTooLong", {
                dialog: rawDifferenceWithPeer.__peer.dialog
            })
        })

        MTProto.UpdatesManager.subscribe("updateChannelNoPeer", async update => {
            console.warn("updateChannelNoPeer NO WAY AAAAAAAAAAAAAAA", update)
        })

        MTProto.UpdatesManager.subscribe("updateNewChannelMessageNoPeer", async update => {
            console.warn("updateNewChannelMessageNoPeer NO WAY AAAAAAAAAAAAAAA", update)
        })

        MTProto.UpdatesManager.subscribe("updateChannelNoDialog", async update => {
            console.warn("updateChannelNoDialog", update)

            this.getPeerDialogs(update.__peer).then(dialogs => {
                if (dialogs.length === 0) {
                    AppEvents.Dialogs.fire("hideDialogByPeer", {
                        peer: update.__peer
                    })
                } else {
                    if (dialogs[0].peer.isLeft) {
                        AppEvents.Dialogs.fire("hideDialogByPeer", {
                            peer: update.__peer
                        })
                    } else {
                        AppEvents.Dialogs.fire("gotNewMany", {
                            dialogs
                        })
                    }
                }
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

        const plain = PeerParser.getPlain(peer, false)

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
        dialog.peer.messages.appendSingleFromRaw(rawTopMessage, false)
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
        const plainPeer = PeerParser.getPlain(rawDialog.peer, false)

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
        const plainPeer = PeerParser.getPlain(rawDialog.peer, false)

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

    onLogout() {
        this.allWasFetched = false

        this.latestDialog = undefined
        this.dialogsOffsetDate = 0 // TODO
        this.offsetDate = 0
        this.count = undefined

        this.isFetched = false
    }
}

const DialogsManager = new DialogManager()

export default DialogsManager