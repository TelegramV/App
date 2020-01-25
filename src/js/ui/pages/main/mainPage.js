import DialogsManager from "../../../api/dialogs/DialogsManager"
import {DialogListComponent} from "./components/dialog/DialogListComponent"
import UpdatesManager from "../../../api/updates/updatesManager"
import PeersManager from "../../../api/peers/PeersManager"
import ChatComponent from "./components/chat/ChatComponent"
import {LocaleController} from "../../../common/locale/localization"
import {ContextMenuComponent} from "../../contextMenuManager";
import {DialogInfoComponent} from "./components/dialog/DialogInfoComponent";
import {ModalComponent} from "../../modalManager";
import {MediaViewerComponent} from "../../mediaViewerManager";
import {InstantViewComponent} from "../../instantViewManager";
import MessagesManager from "../../../api/messages/MessagesManager"

function initHighLevelManagers() {
    UpdatesManager.init().then(() => {
        // todo: move this to DialogsManager logic
        DialogsManager.fetchFirstPage().then(() => {
            DialogsManager.init()
            PeersManager.init()
            MessagesManager.init()
        })
    })
    LocaleController.init()
    StickerManager.getAnimatedEmojiSet()
}

export function MainPage() {
    initHighLevelManagers()

    return (
        <div class="app">
            <ContextMenuComponent/>
            <ModalComponent/>
            <MediaViewerComponent/>
            <InstantViewComponent/>

            <DialogListComponent/>
            <ChatComponent/>
            {/*<DialogInfoComponent/>*/}
        </div>
    )
}
