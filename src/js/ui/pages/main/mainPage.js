import VDOM from "../../framework/vdom"
import DialogsManager from "../../../api/dialogs/dialogsManager"
import {DialogListComponent} from "./components/dialog/dialogListComponent"
import {DialogInfoComponent} from "./components/dialog/dialogInfoComponent"
import {vdom_realMount} from "../../framework/vdom/mount"
import {UICreateMessages} from "./messages/messages"
import UpdatesManager from "../../../api/updatesManager"
import PeersManager from "../../../api/peers/peersManager"
import MessagesWrapperComponent from "./components/message/messagesWrapperComponent"


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
    VDOM.appendToReal(<MessagesWrapperComponent/>, $imPageElement)

    VDOM.appendToReal(<DialogInfoComponent/>, $imPageElement)

    initUIManagers()

    return $imPageElement
}
