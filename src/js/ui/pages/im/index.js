import {AppFramework} from "../../framework/framework"
import {MTProto} from "../../../mtproto"

export class IMPage extends HTMLElement {
    constructor() {
        super()

        if (!MTProto.isUserAuthorized()) {
            AppFramework.Router.push("/login")
        }
    }

    connectedCallback() {
        this.innerHTML = this.render()
    }

    render() {
        return `
    <dialog-list-component></dialog-list-component>
    <div id="chatBlock" style="margin-left:25%;padding:1px 16px;height:1000px;">
    loading..
    </div>
        `
    }
}