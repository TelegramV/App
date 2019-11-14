import {AppTemporaryStorage} from "../../../../common/storage"
import {MTProto} from "../../../../mtproto"
import {FrameworkComponent} from "../../../framework/component"
import {dialogPeerMap, TelegramDialogComponent} from "./dialog"
import VDOM from "../../../framework/vdom"
import {MessageListComponent} from "./messageList"


export class DialogListComponent extends FrameworkComponent {
    constructor(props = {}) {
        super();

        this.init()
    }

    h(context) {
        if (!context.reactive.dialogsSlice) {
            return <h1>Loading..</h1>
        }

        return (
            <div>
                {context.reactive.dialogsSlice.dialogs.map(dialog => {
                    return <div><TelegramDialogComponent constructor={{
                        dialogsSlice: context.reactive.dialogsSlice,
                        dialog: dialog,
                        dataset: {
                            peer: `${dialog.peer._}.${dialog.peer[dialogPeerMap[dialog.peer._] + '_id']}`
                        }
                    }}/></div>
                })}
            </div>
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

            this.reactive.dialogsSlice = dialogsSlice

            // todo: fix this kostyl'
            const chatblock = document.getElementById("message_list")
            chatblock.replaceWith(VDOM.render(<MessageListComponent constructor={{
                dialogsSlice: dialogsSlice
            }}/>))
        })
    }
}