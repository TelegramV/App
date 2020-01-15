import {FileAPI} from "../../fileAPI";
import {createLogger} from "../../../common/logger";
import {getInputPeerFromPeer} from "../../dialogs/util";
import MTProto from "../../../mtproto"
import AppEvents from "../../eventBus/appEvents"
import DialogsStore from "../../store/dialogsStore"

const Logger = createLogger("Peer")

export class Peer {
    constructor(rawPeer) {
        this._rawPeer = rawPeer

        /**
         * @type {Dialog|undefined}
         * @private
         */
        this._dialog = undefined

        this._type = "chat"
        this._id = 0
        this._access_hash = 0
        this._username = undefined
        this._photo = undefined

        this.fillRaw(rawPeer)


        this._peer = rawPeer
        this._avatar = undefined
        this._full = undefined
    }

    get raw() {
        return this._rawPeer
    }

    get id() {
        return this.peer.id
    }

    /**
     * @return {Dialog|undefined}
     */
    get dialog() {
        if (!this._dialog) {
            this.dialog = DialogsStore.get(this.type, this.id)
        }

        return this._dialog
    }

    set dialog(dialog) {
        this._dialog = dialog
    }

    get deleted() {
        return this.peer.pFlags.deleted
    }

    get peer() {
        return this._rawPeer
    }

    get username() {
        return this.peer.username || null
    }

    get verified() {
        return this.peer.pFlags.verified === true
    }

    get peerName() {
        return this.peer.title
    }

    get hasAvatar() {
        return this.peer.photo && this.peer.photo._ !== "chatPhotoEmpty"
    }

    get isMin() {
        return this.peer.pFlags && this.peer.pFlags.min === true
    }

    get inputPeer() {
        return getInputPeerFromPeer(this.type, this.id, this.peer.access_hash)
    }

    get avatarLetter() {
        const split = this.peerName.split(" ")
        return {
            num: Math.abs(this.id) % 8,
            text: split[0].match(/./ug)[0]
        }
    }

    get full() {
        return this._full
    }

    get type() {
        return this.peer._
    }

    getAvatar(big = false) {
        if (this._avatar) {
            return Promise.resolve(this._avatar)
        }
        if (!this.hasAvatar) {
            return Promise.resolve(null)
        }
        if (this.isMin) {
            return Promise.resolve(null)
        }

        // TODO cache
        return FileAPI.getPeerPhoto(big ? this.peer.photo.photo_big : this.peer.photo.photo_small, this.peer.photo.dc_id, this, big).then(url => {
            this._avatar = url

            AppEvents.Peers.fire("updatePhoto", {
                peer: this
            })
            return this._avatar
        }).catch(e => {
            Logger.error("Exception while loading avatar:", e)
        })
    }

    fetchFull() {
        if (this.type === "channel") {
            return MTProto.invokeMethod("channels.getFullChannel", {
                channel: {
                    _: "inputChannel",
                    channel_id: this.id,
                    access_hash: this.peer.access_hash
                }
            }).then(channelFull => {
                this._full = channelFull.full_chat

                AppEvents.Peers.fire("fullLoaded", {
                    peer: this
                })
            })
        } else if (this.type === "chat") {
            return MTProto.invokeMethod("messages.getFullChat", {
                chat_id: this.id
            }).then(chatFull => {
                this._full = chatFull.full_chat

                AppEvents.Peers.fire("fullLoaded", {
                    peer: this
                })
            })
        } else {
            return MTProto.invokeMethod("users.getFullUser", {
                id: {
                    _: "inputUser",
                    user_id: this.id,
                    access_hash: this.peer.access_hash
                }
            }).then(userFull => {
                this._full = userFull

                AppEvents.Peers.fire("fullLoaded", {
                    peer: this
                })
            })
        }
    }

    fillRaw(rawPeer) {
        this._type = rawPeer._
        this._id = rawPeer.id
        this._access_hash = rawPeer.access_hash
        this._username = rawPeer.username
        this._photo = undefined
    }

    fillRawAndFire(rawPeer) {
        this.fillRaw(rawPeer)

        AppEvents.Peers.fire("updateSingle", {
            peer: this
        })
    }
}