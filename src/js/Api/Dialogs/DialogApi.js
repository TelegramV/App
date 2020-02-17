import MTProto from "../../MTProto/external"
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
            pFlags: {
                pinned
            }
        }).then(Bool => {
            console.log(Bool, pinned)
            if (Bool._ === "boolTrue") {
                this._dialog.pinned = pinned
            }
        })
    }

    setArchived(set: boolean) {
        return MTProto.invokeMethod("folders.editPeerFolders", {
            folder_peers: [
                {
                    _: "inputFolderPeer",
                    peer: this._dialog.peer.inputPeer,
                    folder_id: set ? 1 : 0
                }
            ]
        }).then(updates => {
            MTProto.UpdatesManager.process(updates)
        })
    }

    mute(muted: boolean) {
        //
    }

    markDialogUnread(unread) {
        MTProto.invokeMethod("messages.markDialogUnread", {
            flags: 0,
            pFlags: {
                unread: unread
            },
            unread: unread,
            peer: this._dialog.peer.inputPeer
        }).then(Bool => {
            if (Bool._ === "boolTrue") {
                this._dialog.unreadMark = unread
            }
        })
    }
}