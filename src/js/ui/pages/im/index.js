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
            <div id="container" class="grid chats-grid">
                <div class="dialog-container">
                    <div class="dialog-header">
                        <img class="menu-button" src="./icons/menu_svg.svg"/>
                        <div class="search-box">
                            <input class="default-input search-input" type="text" name="search"
                                   placeholder="Search"/></div>
                    </div>
                    <div class="dialog-list-panel">
                        <div class="dialog-list">
                            <DialogListComponent/>
                        </div>
                    </div>

                </div>
                <div id="message_list"/>
                {/*// TODO костыли*/}
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