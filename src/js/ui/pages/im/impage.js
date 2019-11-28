import VDOM from "../../framework/vdom"
import DialogsManager from "../../../api/dialogs/dialogsManager"
import {DialogListComponent} from "./components/dialog/dialogListComponent"


const $imPageElement = VDOM.render(
    <div className="app"/>
)

export function ImPage() {
    VDOM.appendToReal(<DialogListComponent/>, $imPageElement)
    // $imPageElement.appendChild(UICreateMessages())

    DialogsManager.fetchDialogs({})
    return $imPageElement
}
