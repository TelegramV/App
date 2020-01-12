import VDOM from "../../framework/vdom"
import DialogsManager from "../../../api/dialogs/dialogsManager"
import {DialogListComponent} from "./components/dialog/dialogListComponent"
import {DialogInfoComponent} from "./components/dialog/dialogInfoComponent"
import {vdom_realMount} from "../../framework/vdom/mount"
import {UICreateMessages} from "./messages/messages"


const $imPageElement = VDOM.render(
    <div className="app"/>
)

export function ImPage() {
    VDOM.appendToReal(<DialogListComponent/>, $imPageElement)

    $imPageElement.appendChild(UICreateMessages())
    VDOM.appendToReal(<DialogInfoComponent/>, $imPageElement)
    return $imPageElement
}
