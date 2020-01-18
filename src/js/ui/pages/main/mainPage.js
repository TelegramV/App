import DialogsManager from "../../../api/dialogs/dialogsManager"
import {DialogListComponent} from "./components/dialog/dialogListComponent"
import UpdatesManager from "../../../api/updatesManager"
import PeersManager from "../../../api/peers/peersManager"
import ChatComponent from "./components/chat/chatComponent"

function initUIManagers() {
    UpdatesManager.init()
    DialogsManager.init()
    PeersManager.init()
}

export function MainPage() {
    initUIManagers()

    return (
        <div class="app">
            <DialogListComponent/>
            <ChatComponent/>
        </div>
    )
}
