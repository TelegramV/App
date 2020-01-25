import {getInputFromPeer, getInputPeerFromPeer} from "../../dialogs/util";
import MTProto from "../../../mtproto"
import AppEvents from "../../eventBus/AppEvents"
import {PeerPhoto} from "./PeerPhoto"
import {Dialog} from "../dialog/Dialog"
import {PeerApi} from "./PeerApi"
import {ReactiveObject} from "../../../ui/v/reactive/ReactiveObject"

export class Peer extends ReactiveObject {

    #rawPeer
    #filled = false
    #dialog
    #photo
    #accessHash
    #min_messageId
    #min_inputPeer
    #full
    #api

    constructor(rawPeer, dialog = undefined) {
        super()

        this.#rawPeer = rawPeer
        this.#dialog = dialog || Dialog.createEmpty(this)

        this.#photo = PeerPhoto.createEmpty(this)
        this.#api = new PeerApi(this)

        this.fillRaw(rawPeer)
    }

    /**
     * @return {PeerApi}
     */
    get api() {
        return this.#api
    }

    /**
     * @private
     * @return {*}
     */
    get raw() {
        return this.#rawPeer
    }

    /**
     * @private
     * @param rawPeer
     */
    set raw(rawPeer) {
        this.#rawPeer = rawPeer
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
        return this.#dialog
    }

    /**
     * @param {Dialog} dialog
     */
    set dialog(dialog) {
        this.#dialog = dialog
    }

    get accessHash() {
        return this.#accessHash
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
                peer: this.#min_inputPeer,
                msg_id: this.#min_messageId,
                user_id: this.id
            }
        } else if (this.type === "channel") {
            return {
                _: "inputPeerChannelFromMessage",
                peer: this.#min_inputPeer,
                msg_id: this.#min_messageId,
                channel_id: this.id
            }
        } else {
            console.warn("Potential BUG: cannot get inputPeerFromMessage, returning channel")

            return {
                _: "inputPeerChannelFromMessage",
                peer: this.#min_inputPeer,
                msg_id: this.#min_messageId,
                channel_id: this.id
            }
        }
    }

    /**
     * @return {PeerPhoto}
     */
    get photo() {
        return this.#photo
    }

    /**
     * Sets the new photo
     * @param photo
     */
    set photo(photo) {
        this.#photo = photo
    }

    /**
     * @return {*|undefined}
     */
    get full() {
        return this.#full
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
            this.#full = userFull

            this.fire("fullLoaded")

            // todo: delete this thing
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
            console.error("BUG: what the hell??")
        }

        // When receiving said (min) constructors, the client must first check if user or chat object without min flag is already present in local cache. If it is present, then the client should just ignore constructors with min flag and use local one instead.
        if (rawPeer.pFlags && rawPeer.pFlags.min === true && this.#filled) {
            return
        }

        this.raw = rawPeer

        // НЕ РУХАЙ
        if (this.accessHash === undefined) {
            this.#accessHash = this.raw.access_hash
        } else if (rawPeer.pFlags && !rawPeer.pFlags.min) {
            this.#accessHash = this.raw.access_hash
        }

        if (this.isMin) {
            this.#photo.fillRaw(false)
        } else {
            this.#photo.fillRaw(rawPeer.photo)
        }

        this.#filled = true
    }

    /**
     * @param rawPeer
     */
    fillRawAndFire(rawPeer) {
        this.fillRaw(rawPeer)

        this.fire("updateSingle")

        AppEvents.Peers.fire("updateSingle", {
            peer: this
        })
    }
}