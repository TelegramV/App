export class DraftMessage {

    _type = "draftMessageEmpty"
    _rawDraftMessage

    _dialog

    constructor(dialog, rawDraftMessage) {
        this._dialog = dialog

        this._type = "draftMessageEmpty"

        this.fillRaw(rawDraftMessage)
    }

    get raw() {
        return this._rawDraftMessage
    }

    get dialog() {
        return this._dialog
    }

    get isEmpty() {
        return this._type === "draftMessageEmpty" || this.message === ""
    }

    get isPresent() {
        return !this.isEmpty
    }

    get noWebpage() {
        return this.raw.no_webpage || true
    }

    get replyToMsgId() {
        return this.raw.reply_to_msg_id || -1
    }

    get message() {
        return this.raw.message || ""
    }

    get entities() {
        return this.raw.entities || []
    }

    get date() {
        return this.raw.date || 0
    }

    /**
     * @param dialog
     * @return {DraftMessage}
     */
    static createEmpty(dialog) {
        return new DraftMessage(dialog, {
            _: "draftMessageEmpty"
        })
    }

    fillRaw(rawDraftMessage) {
        this._rawDraftMessage = rawDraftMessage

        if (!rawDraftMessage || rawDraftMessage._ === "draftMessageEmpty") {
            this._type = "draftMessageEmpty"
        } else {
            this._type = rawDraftMessage._ || true
        }
    }

    fillRawAndFire(rawDraftMessage) {
        this.fillRaw(rawDraftMessage)

        this.dialog.fire("updateDraftMessage")
    }
}