import VDOM from "../../framework/vdom"
import DialogsManager from "../../../api/dialogs/dialogsManager"
import {DialogListComponent} from "./components/dialog/dialogListComponent"
import {UICreateMessages} from "./messages/messages"
import UpdatesManager from "../../../api/updatesManager"
import PeersManager from "../../../api/peers/peersManager"


const $imPageElement = VDOM.render(
    <div className="app"/>
)


function initUIManagers() {
    UpdatesManager.init()
    DialogsManager.init()
    PeersManager.init()
}

export function ImPage() {
    VDOM.appendToReal(<DialogListComponent/>, $imPageElement)

    $imPageElement.appendChild(UICreateMessages())

    initUIManagers()

    return $imPageElement
}
