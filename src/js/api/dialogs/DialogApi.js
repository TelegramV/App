import MTProto from "../../mtproto/external"
import {Dialog} from "./Dialog"

/**
 * @property {Dialog} dialog
 */
export class DialogApi {

    _dialog: Dialog

    /**
     * @param {Dialog} dialog
     */
    constructor(dialog: Dialog) {
        this._dialog = dialog
    }

    setPinned(pinned: boolean) {
        return MTProto.invokeMethod("messages.toggleDialogPin", {
            peer: this._dialog.input,
            pinned
        }).then(Bool => {
            if (Bool._ === "boolTrue") {
                this._dialog.pinned = pinned
            }
        })
    }

    markDialogUnread(unread) {
        MTProto.invokeMethod("messages.markDialogUnread", {
            flags: 0,
            pFlags: {
                unread: unread
            },
            unread: unread,
            peer: this._dialog.peer.inputPeer
        }).then(response => {
            console.log(response)
        })
    }
}