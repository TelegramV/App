import {UICreateDialogsSidebar} from "./sidebar/sidebar"
import VDOM from "../../framework/vdom"
import DialogsManager from "../../../api/dialogs/dialogsManager"
import {UICreateMessages} from "./messages/messages"

const $imPageElement = VDOM.render(
    <div className="app"/>
)

export function ImPage() {
    $imPageElement.appendChild(UICreateDialogsSidebar())
    // $imPageElement.appendChild(UICreateMessages())

    DialogsManager.fetchDialogs({})
    return $imPageElement
}
