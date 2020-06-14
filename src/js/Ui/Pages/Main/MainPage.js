import DialogsManager from "../../../Api/Dialogs/DialogsManager"
import UpdatesManager from "../../../Api/Updates/UpdatesManager"
import PeersManager from "../../../Api/Peers/PeersManager"
import MessagesManager from "../../../Api/Messages/MessagesManager"
import ContextMenuComponent from "../../Components/Singleton/ContextMenuComponent"
import ModalContainer from "../../Components/Singleton/ModalContainer"
import {MediaViewerComponent} from "../../Components/Singleton/MediaViewerComponent"
import {InstantViewComponent} from "../../Components/Singleton/InstantViewComponent"
import {DialogsBar} from "../../Components/Sidebars/Left/Dialogs/DialogsBar"
import ChatComponent from "../../Components/Columns/Chat/ChatComponent"
import {SettingsComponent} from "../../Components/Sidebars/Left/Settings/SettingsComponent"
import {SearchPanelComponent} from "../../Components/Sidebars/Left/Search/SearchPanelComponent"
import MessagesSearchComponent from "../../Components/Sidebars/Right/Search/MessagesSearchComponent"
import {DialogInfoComponent} from "../../Components/Sidebars/Right/DialogInfo/DialogInfoComponent"
import TopPeers from "../../../Api/Peers/TopPeers"
import {StickerManager} from "../../../Api/Stickers/StickersManager";
import WallpaperManager from "../../Managers/WallpaperManager";
import FoldersManager from "../../../Api/Dialogs/FolderManager";
import Localization from "../../../Api/Localization/Localization";
import {PhoneCallComponent} from "../../Components/Singleton/PhoneCallComponent";
import {throttle} from "../../../Utils/func"
import {LeftSidebars} from "../../Components/SidebarsNeo/Left/LeftSidebars";
import {RightSidebars} from "../../Components/SidebarsNeo/Right/RightSidebars";

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

    window.addEventListener('resize', throttle(() => {
        vhFix();
    }, 500));

    return (
        <div class="app">
            <ContextMenuComponent/>
            <ModalContainer/>
            <MediaViewerComponent/>
            <InstantViewComponent/>
            {/*<SnackbarComponent/>*/}
            {/*<SettingsComponent/>*/}

            <LeftSidebars/>
            {/*<div className="sidebar-wrapper left">*/}
            {/*    <SettingsSidebar/>*/}
            {/*    /!*<LanguageSidebar/>*!/*/}
            {/*    /!*<GeneralSidebar/>*!/*/}
            {/*    /!*<NotificationsSidebar/>*!/*/}
            {/*    /!*<PrivacySidebar/>*!/*/}
            {/*    /!*<ActiveSessionsSidebar/>*!/*/}
            {/*    /!*<BlockedSidebar/>*!/*/}
            {/*    <DialogsSidebar/>*/}
            {/*</div>*/}


            {/*<SettingsComponent/>*/}
            <PhoneCallComponent/>

            {/*<SearchPanelComponent/>*/}
            {/*<CreateChannelBar/>*/}
            {/*<ArchivedDialogsBar/> /!* critical: archived bar should be always before dialogs bar *!/*/}

            {/*<DialogsBar/>*/}
            <ChatComponent/>


            {/*<DialogInfoComponent/>*/}
            {/*<MessagesSearchComponent/>*/}
            {/*<ForwardBarComponent/>*/}
        </div>
    )
}
