import DialogsManager from "../../../Api/Dialogs/DialogsManager"
import UpdatesManager from "../../../Api/Updates/updatesManager"
import PeersManager from "../../../Api/Peers/Objects/PeersManager"
import {LocaleController} from "../../../Api/Localization/Localization"
import MessagesManager from "../../../Api/Messages/MessagesManager"
import {ContextMenuComponent} from "../../Fuck/contextMenuManager"
import {ModalComponent} from "../../Fuck/modalManager"
import {MediaViewerComponent} from "../../Fuck/mediaViewerManager"
import {InstantViewComponent} from "../../Fuck/instantViewManager"
import {DialogsBar} from "../../Components/Main/sidebars/left/dialog/DialogsBar"
import ChatComponent from "../../Components/Main/chat/ChatComponent"
import {SettingsComponent} from "../../Components/Main/sidebars/left/settings/SettingsComponent"
import {SearchPanelComponent} from "../../Components/Main/sidebars/left/search/SearchPanelComponent"
import MessagesSearchComponent from "../../Components/Main/sidebars/right/search/MessagesSearchComponent"
import {DialogInfoComponent} from "../../Components/Main/sidebars/right/dialogInfo/DialogInfoComponent"
import {ArchivedDialogsBar} from "../../Components/Main/sidebars/left/dialog/ArchivedDialogsBar"
import TopPeers from "../../../Api/Peers/TopPeers"
import {StickerManager} from "../../../Api/Stickers/StickersManager";
import {PhoneCallComponent} from "../../Components/Main/calls/PhoneCallComponent";

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
            <PhoneCallComponent/>
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