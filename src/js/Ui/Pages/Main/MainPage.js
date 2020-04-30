import DialogsManager from "../../../Api/Dialogs/DialogsManager"
import UpdatesManager from "../../../Api/Updates/UpdatesManager"
import PeersManager from "../../../Api/Peers/PeersManager"
import MessagesManager from "../../../Api/Messages/MessagesManager"
import ContextMenuComponent from "../../Components/Singleton/ContextMenuComponent"
import {ModalComponent} from "../../Components/Singleton/ModalComponent"
import {MediaViewerComponent} from "../../Components/Singleton/MediaViewerComponent"
import {InstantViewComponent} from "../../Components/Singleton/InstantViewComponent"
import {DialogsBar} from "../../Components/Sidebars/Left/Dialogs/DialogsBar"
import ChatComponent from "../../Components/Columns/Chat/ChatComponent"
import {SettingsComponent} from "../../Components/Sidebars/Left/Settings/SettingsComponent"
import {SearchPanelComponent} from "../../Components/Sidebars/Left/Search/SearchPanelComponent"
import MessagesSearchComponent from "../../Components/Sidebars/Right/Search/MessagesSearchComponent"
import {DialogInfoComponent} from "../../Components/Sidebars/Right/DialogInfo/DialogInfoComponent"
import {ArchivedDialogsBar} from "../../Components/Sidebars/Left/Dialogs/ArchivedDialogsBar"
import TopPeers from "../../../Api/Peers/TopPeers"
import {StickerManager} from "../../../Api/Stickers/StickersManager";
import WallpaperManager from "../../Managers/WallpaperManager";
import SnackbarComponent from "../../Components/Singleton/SnackbarComponent"
import ForwardBarComponent from "../../Components/Sidebars/Right/Search/ForwardBarComponent"
import CreateChannelBar from "../../Components/Sidebars/Left/Create/CreateChannelBar"

function initHighLevelManagers() {
    DialogsManager.fetchFirstPage().then(() => {
        UpdatesManager.init().then(() => {
            // todo: move this to DialogsManager logic
            DialogsManager.init()
            PeersManager.init()
            MessagesManager.init()
            TopPeers.init()
        })
    })
    //LocaleController.init()
    StickerManager.fetchSpecialSets();
    WallpaperManager.init();
}

export function MainPage() {
    initHighLevelManagers()

    return (
        <div class="app">
            <ContextMenuComponent/>
            <ModalComponent/>
            <MediaViewerComponent/>
            <InstantViewComponent/>
            <SnackbarComponent/>
            <SettingsComponent/>
            {/*<PhoneCallComponent/>*/}
            {/*TODO move all settings inside it's component*/}

            <SearchPanelComponent/>
            <CreateChannelBar/>
            <ArchivedDialogsBar/> {/* critical: archived bar should be always before dialogs bar */}

            {/*<Folders/>*/}
            <DialogsBar/>
            <ChatComponent/>

            <DialogInfoComponent/>
            <MessagesSearchComponent/>
            <ForwardBarComponent/>
        </div>
    )
}
