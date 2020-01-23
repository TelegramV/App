import DialogsManager from "../../../api/dialogs/dialogsManager"
import {DialogListComponent} from "./components/dialog/dialogListComponent"
import UpdatesManager from "../../../api/updates/updatesManager"
import PeersManager from "../../../api/peers/peersManager"
import ChatComponent from "./components/chat/chatComponent"
import {LocaleController} from "../../../common/locale/localization"
import {ContextMenuComponent} from "../../contextMenuManager";
import {DialogInfoComponent} from "./components/dialog/dialogInfoComponent";
import {ModalComponent} from "../../modalManager";
import {MediaViewerComponent} from "../../mediaViewerManager";
import {InstantViewComponent} from "../../instantViewManager";

function initUIManagers() {
    UpdatesManager.init().then(() => {
        // todo: move this to DialogsManager logic
        DialogsManager.fetchDialogs({}).then(() => {
            DialogsManager.init()
            PeersManager.init()
        })
    })
    LocaleController.init()
}

export function MainPage() {
    initUIManagers()

    return (
        <div class="app">
            <ContextMenuComponent/>
            <ModalComponent/>
            <MediaViewerComponent/>
            <InstantViewComponent/>

            <DialogListComponent/>
            <ChatComponent/>
            <DialogInfoComponent/>
        </div>
    )
}
