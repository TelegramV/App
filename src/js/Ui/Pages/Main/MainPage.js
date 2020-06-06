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
import {Folders} from "../../Components/Sidebars/Left/Dialogs/Folders";
import CreateChannelBar from "../../Components/Sidebars/Left/Create/CreateChannelBar";
import FoldersManager from "../../../Api/Dialogs/FolderManager";
import ForwardBarComponent from "../../Components/Sidebars/Right/ForwardBarComponent";
import Localization from "../../../Api/Localization/Localization";
import {PhoneCallComponent} from "../../Components/Singleton/PhoneCallComponent";

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
    StickerManager.fetchSpecialSets();
    WallpaperManager.init();
    FoldersManager.init()
    Localization.init();   
}

function vhFix() {
    let vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh100', `${vh}px`);
}

export function MainPage() {
    initHighLevelManagers();

    window.document.body.classList.remove("scrollable"); //remove scrollability from login

    //TODO move this somewhere
    vhFix();

    window.addEventListener('resize', () => {
      vhFix();
    });

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
            <CreateChannelBar/>
            <ArchivedDialogsBar/> {/* critical: archived bar should be always before dialogs bar */}

            <DialogsBar/>
            <ChatComponent/>

            <DialogInfoComponent/>
            <MessagesSearchComponent/>
            <ForwardBarComponent/>
        </div>
    )
}
