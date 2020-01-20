import {getInputFromPeer, getInputPeerFromPeer} from "../../dialogs/util";
import MTProto from "../../../mtproto"
import AppEvents from "../../eventBus/appEvents"
import DialogsStore from "../../store/dialogsStore"
import {PeerPhoto} from "./peerPhoto"

export class Peer {
    constructor(rawPeer) {
        this._rawPeer = rawPeer
        this._filled = false

        /**
         * @type {Dialog|undefined}
         * @private
         */
        this._dialog = undefined

        this._photo = PeerPhoto.createEmpty(this)
        this._accessHash = undefined

        // for min constructor
        this._min_messageId = undefined
        this._min_inputPeer = undefined

        this._full = undefined

        this.fillRaw(rawPeer)
    }

    /**
     * @private
     * @return {*}
     */
    get raw() {
        return this._rawPeer
    }

    /**
     * @private
     * @param rawPeer
     */
    set raw(rawPeer) {
        this._rawPeer = rawPeer
    }

    /**
     * @return {number}
     */
    get id() {
        return this.raw.id
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
        return this.raw.pFlags && this.raw.pFlags.deleted
    }

    /**
     * @return {*|string|T|boolean}
     */
    get username() {
        return this.raw.username
    }

    /**
     * @return {boolean}
     */
    get verified() {
        return this.raw.pFlags && this.raw.pFlags.verified === true
    }

    /**
     * @return {string}
     */
    get name() {
        return this.raw.first_name + (this.raw.last_name ? " " + this.raw.last_name : "")
    }

    /**
     * @return {boolean}
     */
    get isMin() {
        return this.raw.pFlags && this.raw.pFlags.min === true
    }

    /**
     * @return {boolean}
     */
    get isSelf() {
        return this.raw.pFlags && this.raw.pFlags.self === true
    }

    /**
     * @return {{_: string, chat_id: *}|{user_id: *, access_hash: string, _: string}|{access_hash: string, channel_id: *, _: string}|{_: string}}
     */
    get inputPeer() {
        return getInputPeerFromPeer(this.type, this.id, this.accessHash)
    }

    get input() {
        return getInputFromPeer(this.type, this.id, this.accessHash)
    }

    get inputPeerFromMessage() {
        if (this.type === "user") {
            return {
                _: "inputPeerUserFromMessage",
                peer: this._min_inputPeer,
                msg_id: this._min_messageId,
                user_id: this.id
            }
        } else if (this.type === "channel") {
            return {
                _: "inputPeerChannelFromMessage",
                peer: this._min_inputPeer,
                msg_id: this._min_messageId,
                channel_id: this.id
            }
        } else {
            console.warn("Potential BUG: cannot get inputPeerFromMessage, returning channel")

            return {
                _: "inputPeerChannelFromMessage",
                peer: this._min_inputPeer,
                msg_id: this._min_messageId,
                channel_id: this.id
            }
        }
    }

    /**
     * @return {PeerPhoto}
     */
    get photo() {
        return this._photo
    }

    /**
     * Sets the new photo
     * @param photo
     */
    set photo(photo) {
        this._photo = photo
    }

    /**
     * @return {*|undefined}
     */
    get full() {
        return this._full
    }

    /**
     * Get the type of peer
     * @returns {string}
     */
    get type() {
        return this.raw._
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        return MTProto.invokeMethod("users.getFullUser", {
            id: this.inputPeer
        }).then(userFull => {
            this._full = userFull

            AppEvents.Peers.fire("fullLoaded", {
                peer: this
            })
        })
    }

    /**
     * CRITICAL TODO: handle min if filled non-min!!!!!!!!!!!!!!!!!!
     * @param rawPeer
     */
    fillRaw(rawPeer) {
        if (rawPeer._ !== this.type || rawPeer.id !== this.id) {
            throw new Error("peer data cannot be filled")
        }

        // When receiving said constructors, the client must first check if user or chat object without min flag is already present in local cache. If it is present, then the client should just ignore constructors with min flag and use local one instead.
        if (rawPeer.pFlags && rawPeer.pFlags.min === true && this._filled) {
            return
        }

        this.raw = rawPeer

        // НЕ РУХАЙ
        if (this.accessHash === undefined) {
            this._accessHash = this.raw.access_hash
        } else if (rawPeer.pFlags && !rawPeer.pFlags.min) {
            this._accessHash = this.raw.access_hash
        }

        if (this.isMin) {
            this._photo.fillRaw(false)
        } else {
            this._photo.fillRaw(rawPeer.photo)
        }

        this._filled = true
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