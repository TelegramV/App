import {UICreateDialogsSidebar} from "./sidebar/sidebar"
import VDOM from "../../framework/vdom"
import DialogsManager from "../../../api/dialogs/dialogsManager"
import {UICreateMessages} from "./messages/messages"

const $imElement = VDOM.render(
    <div className="app"/>
)

export default () => {
    $imElement.appendChild(UICreateDialogsSidebar())
    $imElement.appendChild(UICreateMessages())

    DialogsManager.fetchDialogs({})
    return $imElement
}
