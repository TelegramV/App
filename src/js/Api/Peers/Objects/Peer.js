import {getInputFromPeer, getInputPeerFromPeer} from "../../Dialogs/util";
import MTProto from "../../../MTProto/External"
import AppEvents from "../../EventBus/AppEvents"
import {PeerPhoto} from "./PeerPhoto"
import {Dialog} from "../../Dialogs/Dialog"
import {PeerApi} from "../PeerApi"
import {ReactiveObject} from "../../../V/Reactive/ReactiveObject"
import {PeerMessages} from "../PeerMessages"
import DialogsStore from "../../Store/DialogsStore"
import type {Message} from "../../Messages/Message";
import {Photo} from "../../Media/Photo";

export class Peer extends ReactiveObject {

    eventBus = AppEvents.Peers
    eventObjectName = "peer"

    _filledNonMin: boolean

    _raw: Object
    _accessHash: string

    _photo: PeerPhoto
    _dialog: Dialog
    _api: PeerApi
    _pinnedMessage: Message

    _min_messageId: number
    _min_inputPeer: Object

    _full: Object

    _messages: PeerMessages

    _isAbleToHandleUpdates: boolean = undefined

    constructor(rawPeer, dialog = undefined) {
        super()

        this._raw = rawPeer
        this._dialog = dialog

        this._photo = PeerPhoto.createEmpty(this)
        this._api = new PeerApi(this)
        this._messages = new PeerMessages(this)

        this.fillRaw(rawPeer)
    }

    // if not, then dialog shouldn't be fetched for new messages
    get isAbleToHandleUpdates(): boolean {
        return true

        if (this._isAbleToHandleUpdates === undefined) {
            this._isAbleToHandleUpdates = this.type === "user"
        }

        return this._isAbleToHandleUpdates
    }

    /**
     * @return {PeerMessages}
     */
    get messages() {
        return this._messages
    }

    /**
     * @return {PeerApi}
     */
    get api() {
        return this._api
    }

    /**
     * @protected
     * @return {*}
     */
    get raw() {
        return this._raw
    }

    /**
     * @private
     * @param rawPeer
     */
    set raw(rawPeer) {
        this._raw = rawPeer
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
            this._dialog = DialogsStore.get(this.type, this.id)

            if (this._dialog) {
                this._dialog.peer = this
            }
        }

        return this._dialog
    }

    get full() {
        return this._full
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

    get isDeleted() {
        return this.raw.deleted
    }

    get username() {
        return this.raw.username
    }

    get statusString() {
        return {
            text: "...",
            online: false
        }
    }

    get isVerified() {
        return this.raw.verified === true
    }

    get firstName() {
        return this.raw.first_name
    }

    get lastName() {
        return this.raw.last_name
    }

    get name() {
        return this.firstName + (this.lastName ? " " + this.lastName : "")
    }

    get isMin() {
        return this.raw.min === true
    }

    get isSelf() {
        return this.raw.self === true
    }

    get isLeft() {
        return this.raw.left === true
    }

    get inputPeer() {
        return this.isMin ? this.inputPeerFromMessage : getInputPeerFromPeer(this.type, this.id, this.accessHash)
    }

    get input() {
        return this.isMin ? this.inputFromMessage : getInputFromPeer(this.type, this.id, this.accessHash)
    }

    get inputChannel() {
        return {
            _: "inputChannel",
            channel_id: this.id,
            access_hash: this.accessHash,
        }
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

    get inputFromMessage() {
        if (this.type === "user") {
            return {
                _: "inputUserFromMessage",
                peer: this._min_inputPeer,
                msg_id: this._min_messageId,
                user_id: this.id
            }
        } else if (this.type === "channel") {
            return {
                _: "inputFromMessage",
                peer: this._min_inputPeer,
                msg_id: this._min_messageId,
                channel_id: this.id
            }
        } else {
            console.warn("Potential BUG: cannot get inputPeerFromMessage, returning channel")

            return {
                _: "inputChannelFromMessage",
                peer: this._min_inputPeer,
                msg_id: this._min_messageId,
                channel_id: this.id
            }
        }
    }

    get pinnedMessageId() {
        return this._pinnedMessageId || (this.full && this.full.pinned_msg_id)
    }

    set pinnedMessageId(value) {
        this._pinnedMessage = null
        this._pinnedMessageId = value
        this.findPinnedMessage()
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
     * Get the type of peer
     * @returns {string}
     */
    get type() {
        return this.raw._
    }

    /**
     * Fetches all peer photos
     */
    // TODO pagination
    fetchPeerPhotos() {
        return MTProto.invokeMethod("photos.getUserPhotos", {
            user_id: this.inputPeer,
            limit: 100,
            offset: 0,
            max_id: -1
        }).then(l => {
            this._photos = l.photos.map(q => {
                const photo = new Photo(q)
                photo.peer = this
                return photo
            })
            return this._photos
        })
    }

    /**
     * @return {Promise<*>}
     */
    fetchFull() {
        return MTProto.invokeMethod("users.getFullUser", {
            id: this.input
        }).then(userFull => {
            this._full = userFull

            this.fire("fullLoaded")

            this.findPinnedMessage()
        })
    }

    findPinnedMessage(fire = true) {
        if (this.pinnedMessageId) {
            if (this._pinnedMessage && fire) {
                this.fire("pinnedMessageFound", {
                    message: this._pinnedMessage
                })
                return
            }

            const message = this.messages.get(this.pinnedMessageId)

            if (message) {
                this._pinnedMessage = message

                if (fire) {
                    this.fire("pinnedMessageFound", {
                        message: this._pinnedMessage
                    })
                }
            } else {
                this.api.getHistory({
                    offset_id: this.pinnedMessageId, // ???
                    add_offset: -1,
                    limit: 1
                }).then(messages => {
                    if (messages.length && messages[0].id === this.pinnedMessageId) {
                        this.messages.appendOtherSingle(messages[0])
                        this._pinnedMessage = messages[0]

                        if (fire) {
                            this.fire("pinnedMessageFound", {
                                message: this._pinnedMessage
                            })
                        }
                    } else {
                        console.log("no pinned!")
                    }
                })
            }
        } else {
            this.fire("pinnedMessageFound", {
                message: null
            })
        }
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
        if (rawPeer.min && this._filledNonMin) {
            return this
        }

        this.raw = rawPeer

        // НЕ РУХАЙ
        if (this.accessHash === undefined) {
            this._accessHash = this.raw.access_hash
        } else if (!rawPeer.min) {
            this._accessHash = this.raw.access_hash
        }

        this._photo.fillRaw(rawPeer.photo)

        if (!this.isMin) {
            this._filledNonMin = true
        }

        return this
    }

    /**
     * @param rawPeer
     */
    fillRawAndFire(rawPeer) {
        this.fillRaw(rawPeer)

        this.fire("updateSingle")

        return this
    }
}