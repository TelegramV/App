import {AppTemporaryStorage} from "../../../../common/storage"
import {MTProto} from "../../../../mtproto"
import {FrameworkComponent} from "../../../framework/component"
import {dialogPeerMap, TelegramDialogComponent} from "./dialog"
import {MessageListComponent} from "./messageList"
import VDOM from "../../../framework/vdom";

export class DialogListComponent extends FrameworkComponent {
    constructor(props = {}) {
        super();

        this.init()
    }

    h(context) {
        if (!context.reactive.dialogsSlice) {
            return <div className="full-size-loader">
                <progress className="progress-circular big"/>
            </div>
        }

        return (
            (
                <div>
                    <div class="list pinned">
                        {
                            context.reactive.pinned.map(dialog => {
                                return <TelegramDialogComponent constructor={{
                                    dialogsSlice: context.reactive.dialogsSlice,
                                    dialog: dialog,
                                    dataset: {
                                        peer: `${dialog.peer._}.${dialog.peer[dialogPeerMap[dialog.peer._] + '_id']}`
                                    }
                                }}/>
                            })
                        }
                    </div>
                    <div class="list">
                        {
                            context.reactive.notPinned.map(dialog => {
                                return <TelegramDialogComponent constructor={{
                                    dialogsSlice: context.reactive.dialogsSlice,
                                    dialog: dialog,
                                    dataset: {
                                        peer: `${dialog.peer._}.${dialog.peer[dialogPeerMap[dialog.peer._] + '_id']}`
                                    }
                                }}/>
                            })
                        }
                    </div>
                </div>
            )
        )
    }

    data() {
        return {
            dialogsSlice: false
        }
    }

    init() {
        return MTProto.invokeMethod("messages.getDialogs", {
            flags: {},
            exclude_pinned: false,
            folder_id: "",
            offset_date: "",
            offset_id: "",
            offset_peer: {
                _: "inputPeerEmpty"
            },
            limit: 20,
            hash: ""
        }).then(dialogsSlice => {
            AppTemporaryStorage.setItem("dialogsSlice", dialogsSlice)
            const pinned =  dialogsSlice.dialogs.filter(l => l.pFlags.pinned)
            const notPinned =  dialogsSlice.dialogs.filter(l => !l.pFlags.pinned)

            this.reactive.pinned = pinned
            this.reactive.notPinned = notPinned

            this.reactive.dialogsSlice = dialogsSlice

            // todo: fix this kostyl'
            const chatblock = document.getElementById("message_list")
            chatblock.replaceWith(VDOM.render(<MessageListComponent constructor={{
                dialogsSlice: dialogsSlice
            }}/>))
        })
    }
}