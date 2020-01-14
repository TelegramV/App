import AppEvents from "../api/eventBus/appEvents"

export class DraftMessage {
    constructor(dialog, rawDraftMessage) {
        this._dialog = dialog
        this._rawDraftMessage = rawDraftMessage

        this._type = "draftMessageEmpty"
        this._noWebpage = true
        this._replyToMsgId = -1
        this._message = ""
        this._entities = []
        this._date = 0

        this.fillRaw(rawDraftMessage)
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
        return this._noWebpage
    }

    get replyToMsgId() {
        return this._replyToMsgId
    }

    get message() {
        return this._message
    }

    get entities() {
        return this._entities
    }

    get date() {
        return this._date
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
        if (!rawDraftMessage || rawDraftMessage._ === "draftMessageEmpty") {
            this._type = "draftMessageEmpty"
        } else {
            this._type = rawDraftMessage._ || true
            this._noWebpage = rawDraftMessage.no_webpage || true
            this._replyToMsgId = rawDraftMessage.reply_to_msg_id || -1
            this._message = rawDraftMessage.message || ""
            this._entities = rawDraftMessage.entities || []
            this._date = rawDraftMessage.date || 0
        }
    }

    fillRawAndFire(rawDraftMessage) {
        this.fillRaw(rawDraftMessage)

        AppEvents.Dialogs.fire("updateDraftMessage", {
            dialog: this.dialog
        })
    }
}