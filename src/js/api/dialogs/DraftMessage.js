import AppEvents from "../eventBus/AppEvents"

export class DraftMessage {
    
    #dialog
    #rawDraftMessage
    #type = "draftMessageEmpty"
    #noWebpage = true
    #replyToMsgId = -1
    #message = ""
    #entities = []
    #date = 0
    
    constructor(dialog, rawDraftMessage) {
        this.#dialog = dialog
        this.#rawDraftMessage = rawDraftMessage

        this.#type = "draftMessageEmpty"
        this.#noWebpage = true
        this.#replyToMsgId = -1
        this.#message = ""
        this.#entities = []
        this.#date = 0

        this.fillRaw(rawDraftMessage)
    }

    get raw() {
        return this.#rawDraftMessage
    }

    get dialog() {
        return this.#dialog
    }

    get isEmpty() {
        return this.#type === "draftMessageEmpty" || this.message === ""
    }

    get isPresent() {
        return !this.isEmpty
    }

    get noWebpage() {
        return this.#noWebpage
    }

    get replyToMsgId() {
        return this.#replyToMsgId
    }

    get message() {
        return this.#message
    }

    get entities() {
        return this.#entities
    }

    get date() {
        return this.#date
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
            this.#type = "draftMessageEmpty"
        } else {
            this.#type = rawDraftMessage._ || true
            this.#noWebpage = rawDraftMessage.no_webpage || true
            this.#replyToMsgId = rawDraftMessage.reply_to_msg_id || -1
            this.#message = rawDraftMessage.message || ""
            this.#entities = rawDraftMessage.entities || []
            this.#date = rawDraftMessage.date || 0
        }
    }

    fillRawAndFire(rawDraftMessage) {
        this.fillRaw(rawDraftMessage)

        AppEvents.Dialogs.fire("updateDraftMessage", {
            dialog: this.dialog
        })
    }
}