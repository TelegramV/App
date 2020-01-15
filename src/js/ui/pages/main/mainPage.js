import VDOM from "../../framework/vdom"
import DialogsManager from "../../../api/dialogs/dialogsManager"
import {DialogListComponent} from "./components/dialog/dialogListComponent"
import {DialogInfoComponent} from "./components/dialog/dialogInfoComponent"
import UpdatesManager from "../../../api/updatesManager"
import PeersManager from "../../../api/peers/peersManager"
import ChatComponent from "./components/chat/chatComponent"


const $imPageElement = VDOM.render(
    <div className="app"/>
)


function initUIManagers() {
    UpdatesManager.init()
    DialogsManager.init()
    PeersManager.init()
}

export function MainPage() {
    VDOM.appendToReal(<DialogListComponent/>, $imPageElement)
    VDOM.appendToReal(<ChatComponent/>, $imPageElement)

    // VDOM.appendToReal(<DialogInfoComponent/>, $imPageElement)

    initUIManagers()

    return $imPageElement
}
