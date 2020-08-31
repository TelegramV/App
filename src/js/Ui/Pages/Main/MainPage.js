import DialogsManager from "../../../Api/Dialogs/DialogsManager"
import UpdatesManager from "../../../Api/Updates/UpdatesManager"
import PeersManager from "../../../Api/Peers/PeersManager"
import MessagesManager from "../../../Api/Messages/MessagesManager"
import ContextMenuComponent from "../../Components/Singleton/ContextMenuComponent"
import ModalContainer from "../../Components/Singleton/ModalContainer"
import {MediaViewerComponent} from "../../Components/Singleton/MediaViewerComponent"
import {InstantViewComponent} from "../../Components/Singleton/InstantViewComponent"
import ChatComponent from "../../Components/Columns/Chat/ChatComponent"
import TopPeers from "../../../Api/Peers/TopPeers"
import {StickerManager} from "../../../Api/Stickers/StickersManager";
import WallpaperManager from "../../Managers/WallpaperManager";
import FoldersManager from "../../../Api/Dialogs/FolderManager";
import EmojiLangpack from "../../../Api/Localization/EmojiLangpack";
import DeepLinkManager from "../../../Api/Telegram/DeepLinkManager";
import {PhoneCallComponent} from "../../Components/Singleton/PhoneCallComponent";
import {throttle} from "../../../Utils/func"
import {LeftSidebars} from "../../Components/SidebarsNeo/Left/LeftSidebars";
import {ForwardSidebar} from "../../Components/SidebarsNeo/Right/ForwardSidebar";
import PiPContainer from "../../Components/Video/PiPContainer"
import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf";
import {IS_SAFARI, IS_MOBILE_SCREEN} from "../../../Utils/browser";
import {RightSidebars} from "../../Components/SidebarsNeo/Right/RightSidebars"
import classIf from "../../../V/VRDOM/jsx/helpers/classIf";
import AudioPlayerComponent from "../../Components/Singleton/AudioPlayerComponent"
import ConfettiComponent from "../../Components/Singleton/ConfettiComponent"
import InlineBotApi from "../../../Api/Bots/InlineBotManager"
import BlockedManager from "../../../Api/Contacts/BlockedManager"
import {OnTopConsole} from "../../Components/Debug/OnTopConsole";

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
    InlineBotApi.init();
    WallpaperManager.init();
    FoldersManager.init()
    EmojiLangpack.init();
    DeepLinkManager.init();
    BlockedManager.init();
}

export function MainPage() {
    initHighLevelManagers();

    window.document.body.classList.remove("scrollable"); //remove scrollability after login

    return (
        <div id="app" class={["app", classIf(IS_SAFARI, "safari")]}>
            <ContextMenuComponent/>
            <ModalContainer/>
            <MediaViewerComponent/>
            <InstantViewComponent/>
            <ConfettiComponent/>
            {/*<SnackbarComponent/>*/}
            {/*<SettingsComponent/>*/}
            <AudioPlayerComponent/>

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

            <ForwardSidebar/>
            <PiPContainer/>

            <RightSidebars/>
            {nodeIf(<OnTopConsole/>, IS_SAFARI)}
            {/*{nodeIf(<RightSidebars/>, IS_MOBILE_SCREEN)}*/}


            {/*<DialogInfoComponent/>*/}
            {/*<MessagesSearchComponent/>*/}
            {/*<ForwardBarComponent/>*/}
        </div>
    )
}
