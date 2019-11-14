import {AppFramework} from "../../framework/framework"
import {MTProto} from "../../../mtproto"
import VDOM from "../../framework/vdom"
import {DialogListComponent} from "./components/dialogList"
import {MessageListComponent} from "./components/messageList";

export class IMPage extends HTMLElement {
    constructor() {
        super()

        if (!MTProto.isUserAuthorized()) {
            AppFramework.Router.push("/login")
        }

        this.vNode = (
            <div class="app">
                <div class="chatlist">
                    <div class="toolbar">
                        <div class="btn-icon rp rps tgico-menu"></div>
                        <div class="search">
                            <div class="input-search">
                                <input type="text" placeholder="Search"/><span class="tgico tgico-search"></span>
                            </div>
                        </div>
                    </div>
                    <div class="list pinned">
                    </div>
                    <div class="list">
                        <DialogListComponent/>
                    </div>
                    {/*// TODO костыли*/}
                </div>
                <div id="message_list"/>

            </div>
        )
    }

    connectedCallback() {
        this.render()
    }

    render() {
        this.innerHTML = ""
        if (this.vNode) {
            this.appendChild(VDOM.render(this.vNode))
        }
    }
}