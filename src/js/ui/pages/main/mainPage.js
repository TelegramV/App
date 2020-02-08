import DialogsManager from "../../../api/dialogs/DialogsManager"
import UpdatesManager from "../../../api/updates/updatesManager"
import PeersManager from "../../../api/peers/objects/PeersManager"
import {LocaleController} from "../../../common/locale/localization"
import MessagesManager from "../../../api/messages/MessagesManager"
import {ContextMenuComponent} from "../../contextMenuManager"
import {ModalComponent} from "../../modalManager"
import {MediaViewerComponent} from "../../mediaViewerManager"
import {InstantViewComponent} from "../../instantViewManager"
import {DialogsBar} from "./sidebars/left/dialog/DialogsBar"
import ChatComponent from "./components/chat/ChatComponent"
import {SettingsComponent} from "./sidebars/left/settings/SettingsComponent"
import {SearchPanelComponent} from "./sidebars/left/search/SearchPanelComponent"
import MessagesSearchComponent from "./sidebars/right/search/MessagesSearchComponent"
import {DialogInfoComponent} from "./sidebars/right/dialogInfo/DialogInfoComponent"
import {ArchivedDialogsBar} from "./sidebars/left/dialog/ArchivedDialogsBar"
import TopPeers from "../../../api/peers/TopPeers"

function initHighLevelManagers() {
    UpdatesManager.init().then(() => {
        // todo: move this to DialogsManager logic
        DialogsManager.fetchFirstPage().then(() => {
            DialogsManager.init()
            PeersManager.init()
            MessagesManager.init()
            TopPeers.init()
        })
    })
    LocaleController.init()
    StickerManager.getAnimatedEmojiSet()
    // WallpaperManager.init();
}

export function MainPage() {
    initHighLevelManagers()

    return (
        <div class="app">
            <ContextMenuComponent/>
            <ModalComponent/>
            <MediaViewerComponent/>
            <InstantViewComponent/>
            <SettingsComponent/>
            {/*TODO move all settings inside it's component*/}


            <SearchPanelComponent/>

            <ArchivedDialogsBar/> {/* critical: archived bar should be always before dialogs bar */}
            <DialogsBar/>
            <ChatComponent/>

            <DialogInfoComponent/>
            <MessagesSearchComponent/>
        </div>
    )
}
