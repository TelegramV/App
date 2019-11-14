import {AppTemporaryStorage} from "../../../../common/storage"
import {MTProto} from "../../../../mtproto"
import {dialogPeerMap, TelegramDialogComponent} from "./dialog"
import {MessageListComponent} from "./messageList"

const VDOM = require("../../../framework/vdom")

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
        this.innerHTML = `<div class="full-size-loader"><progress class="progress-circular big"/></div>`

        return await MTProto.invokeMethod("messages.getDialogs", {
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

            this.vNode = (
                <div>
                    <div class="list pinned">
                        {
                            pinned.map(dialog => {
                                return <TelegramDialogComponent constructor={{
                                    dialogsSlice: dialogsSlice,
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
                            notPinned.map(dialog => {
                                return <TelegramDialogComponent constructor={{
                                    dialogsSlice: dialogsSlice,
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


            const chatblock = document.getElementById("message_list")
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