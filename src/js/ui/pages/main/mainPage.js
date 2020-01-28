import DialogsManager from "../../../api/dialogs/DialogsManager"
import PeersManager from "../../../api/peers/PeersManager"
import {LocaleController} from "../../../common/locale/localization"
import MessagesManager from "../../../api/messages/MessagesManager"
import {ContextMenuComponent} from "../../contextMenuManager"
import {ModalComponent} from "../../modalManager"
import {MediaViewerComponent} from "../../mediaViewerManager"
import {InstantViewComponent} from "../../instantViewManager"
import {DialogListComponent} from "./components/dialog/DialogListComponent"
import ChatComponent from "./components/chat/ChatComponent"
import {XUpdatesManager} from "../../../api/updates/XUpdatesManager"

function initHighLevelManagers() {
    XUpdatesManager.init().then(() => {
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
