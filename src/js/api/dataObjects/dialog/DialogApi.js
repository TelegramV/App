import MTProto from "../../../mtproto/external"

/**
 * @property {Dialog} dialog
 */
export class DialogApi {

    #dialog

    /**
     * @param {Dialog} dialog
     */
    constructor(dialog) {
        this.#dialog = dialog
    }

    setPinned(pinned) {
        return MTProto.invokeMethod("messages.toggleDialogPin", {
            peer: {
                _: "inputDialogPeer"
            },
            pinned
        }).then(l => {
            this.#dialog.pinned = l
        })
    }

    markDialogUnread(unread) {
        MTProto.invokeMethod("messages.markDialogUnread", {
            flags: 0,
            pFlags: {
                unread: unread
            },
            unread: unread,
            peer: this.#dialog.peer.inputPeer
        }).then(response => {
            console.log(response)
        })
    }
}