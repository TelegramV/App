import {AppTemporaryStorage} from "../../../../common/storage"
import {MTProto} from "../../../../mtproto"
import {dialogPeerMap, TelegramDialogComponent} from "./dialog"
import {MessageListComponent} from "./messageList"
import VDOM from "../../../framework/vdom"

export class DialogListComponent extends HTMLElement {
    constructor() {
        super();
        this.classList.add("dialogs")
        this.vNode = null
    }

    connectedCallback() {
        this.initVNode().then(() => {
            this.render()
        })
    }

    async initVNode() {
        this.innerHTML = "loading.."

        return await MTProto.invokeMethod("messages.getDialogs", {
            flags: {},
            exclude_pinned: false,
            folder_id: "",
            offset_date: "",
            offset_id: "",
            offset_peer: {
                _: "inputPeerEmpty"
            },
            limit: "",
            hash: ""
        }).then(dialogsSlice => {
            AppTemporaryStorage.setItem("dialogsSlice", dialogsSlice)

            this.vNode = VDOM.h("div", {
                children: dialogsSlice.dialogs.map(dialog => {
                    return VDOM.h(TelegramDialogComponent, {
                        options: {
                            dialogsSlice: dialogsSlice,
                            dialog: dialog,
                            dataset: {
                                peer: `${dialog.peer._}.${dialog.peer[dialogPeerMap[dialog.peer._] + '_id']}`
                            }
                        }
                    })
                })
            })

            const chatblock = document.getElementById("chatBlock")
            chatblock.innerHTML = ""
            chatblock.appendChild(new MessageListComponent({
                dialogsSlice: dialogsSlice
            }))
        })
    }

    render() {
        this.innerHTML = ""
        if (this.vNode) {
            this.appendChild(VDOM.render(this.vNode))
        }
    }
}