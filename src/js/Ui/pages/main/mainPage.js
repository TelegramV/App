import DialogsManager from "../../../Api/Dialogs/DialogsManager"
import UpdatesManager from "../../../Api/Updates/updatesManager"
import PeersManager from "../../../Api/Peers/Objects/PeersManager"
import {LocaleController} from "../../../Api/Localization/Localization"
import MessagesManager from "../../../Api/Messages/MessagesManager"
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
import TopPeers from "../../../Api/Peers/TopPeers"
import {StickerManager} from "../../../Api/Stickers/StickersManager";

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
