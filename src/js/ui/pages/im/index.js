import {AppFramework} from "../../framework/framework"
import {MTProto} from "../../../mtproto"
import VDOM from "../../framework/vdom"
import {DialogListComponent} from "./components/dialogList"

export class IMPage extends HTMLElement {
    constructor() {
        super()

        if (!MTProto.isUserAuthorized()) {
            AppFramework.Router.push("/login")
        }

        this.vNode = (
            <div>
                <DialogListComponent/>
                <div id="chatBlock" style="margin-left:25%;padding:1px 16px;height:1000px;">
                    loading...
                </div>
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