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

        this._photo = PeerPhoto.createEmpty(this)

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
        return this.raw.access_hash
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
        return this.raw.username
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
        return this.raw.first_name + (this.raw.last_name ? " " + this.raw.last_name : "")
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
        return "user"
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
     * @param rawPeer
     */
    fillRaw(rawPeer) {
        if (rawPeer._ !== this.type || rawPeer.id !== this.id) {
            throw new Error("peer data cannot be filled")
        }

        this.raw = rawPeer

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