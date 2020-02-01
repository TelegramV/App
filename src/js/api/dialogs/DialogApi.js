import MTProto from "../../mtproto/external"
import {Dialog} from "./Dialog"

/**
 * @property {Dialog} dialog
 */
export class DialogApi {

    _dialog

    /**
     * @param {Dialog} dialog
     */
    constructor(dialog: Dialog) {
        this._dialog = dialog
    }

    setPinned(pinned) {
        return MTProto.invokeMethod("messages.toggleDialogPin", {
            peer: {
                _: "inputDialogPeer"
            },
            pinned
        }).then(l => {
            this._dialog.pinned = l
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