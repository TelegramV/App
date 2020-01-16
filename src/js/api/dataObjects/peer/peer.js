import {getInputPeerFromPeer} from "../../dialogs/util";
import MTProto from "../../../mtproto"
import AppEvents from "../../eventBus/appEvents"
import DialogsStore from "../../store/dialogsStore"
import {PeerPhoto} from "./peerPhoto"

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
        this._accessHash = 0
        this._username = undefined
        this._photo = PeerPhoto.createEmpty(this)

        this._full = undefined

        this.fillRaw(rawPeer)
    }

    /**
     * @return {*}
     */
    get raw() {
        return this._rawPeer
    }

    get peer() {

    }

    /**
     * @return {number}
     */
    get id() {
        return this._id || this.raw.id
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

    /**
     * @param {Dialog} dialog
     */
    set dialog(dialog) {
        this._dialog = dialog
    }

    get accessHash() {
        return this._accessHash
    }

    /**
     * @return {boolean}
     */
    get isDeleted() {
        return this.raw.pFlags.deleted
    }

    /**
     * @return {*|string|T|boolean}
     */
    get username() {
        return this._username || false
    }

    /**
     * @return {boolean}
     */
    get verified() {
        return this.raw.pFlags.verified === true
    }

    /**
     * @return {string}
     */
    get name() {
        return this.raw.title || this.raw.first_name + " " + this.raw.last_name || " "
    }

    /**
     * @return {boolean}
     */
    get isMin() {
        return this.raw.pFlags && this.raw.pFlags.min === true
    }

    /**
     * @return {{_: string, chat_id: *}|{user_id: *, access_hash: string, _: string}|{access_hash: string, channel_id: *, _: string}|{_: string}}
     */
    get inputPeer() {
        return getInputPeerFromPeer(this.type, this.id, this.accessHash)
    }

    /**
     * @return {PeerPhoto}
     */
    get photo() {
        return this._photo
    }

    /**
     * @return {*|undefined}
     */
    get full() {
        return this._full
    }

    /**
     * @return {string}
     */
    get type() {
        return this._type
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        if (this.type === "channel") {
            return MTProto.invokeMethod("channels.getFullChannel", {
                channel: {
                    _: "inputChannel",
                    channel_id: this.id,
                    access_hash: this.accessHash
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
                    access_hash: this.accessHash
                }
            }).then(userFull => {
                this._full = userFull

                AppEvents.Peers.fire("fullLoaded", {
                    peer: this
                })
            })
        }
    }

    /**
     * @param rawPeer
     */
    fillRaw(rawPeer) {
        this._type = rawPeer._
        this._id = rawPeer.id
        this._accessHash = rawPeer.access_hash
        this._username = rawPeer.username

        if (this.isMin) {
            this._photo.fillRaw(false)
        } else {
            this._photo.fillRaw(rawPeer.photo)
        }
    }

    /**
     * @param rawPeer
     */
    fillRawAndFire(rawPeer) {
        this.fillRaw(rawPeer)

        AppEvents.Peers.fire("updateSingle", {
            peer: this
        })
    }
}