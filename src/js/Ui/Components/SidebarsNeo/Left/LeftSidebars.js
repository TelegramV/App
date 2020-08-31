import {GenericSidebarHistory} from "../GenericSidebarHistory";
import {SettingsSidebar} from "./Settings/SettingsSidebar";
import {DialogsSidebar} from "./Dialogs/DialogsSidebar";
import {PrivacySidebar} from "./Settings/Privacy/PrivacySidebar";
import {NotificationsSidebar} from "./Settings/Notifications/NotificationsSidebar";
import {LanguageSidebar} from "./Settings/LanguageSidebar";
import {ActiveSessionsSidebar} from "./Settings/Privacy/ActiveSessionsSidebar";
import {BlockedUsersSidebar} from "./Settings/Privacy/BlockedUsersSidebar";
import {GeneralSidebar} from "./Settings/General/GeneralSidebar";
import {BackgroundImageSidebar} from "./Settings/General/Background/BackgroundImageSidebar";
import {BackgroundColorSidebar} from "./Settings/General/Background/BackgroundColorSidebar";
import {ArchivedSidebar} from "./Dialogs/ArchivedSidebar";
import {FoldersSidebar} from "./Settings/Folders/FoldersSidebar";
import {CreateFolderSidebar} from "./Settings/Folders/CreateFolderSidebar";
import {FolderPeersSidebar} from "./Settings/Folders/FolderPeersSidebar";
import {SuperSecretSettingsSidebar} from "./Settings/SuperSecretSettingsSidebar";
import {CreateChannelSidebar} from "./NewChats/CreateChannelSidebar"

export class LeftSidebars extends GenericSidebarHistory {
    render() {
        return (
            <div className="sidebar-wrapper left">

                <DialogsSidebar/>
                <ArchivedSidebar/>

                <SettingsSidebar/>


                <GeneralSidebar/>
                <FoldersSidebar/>
                <CreateFolderSidebar/>
                <FolderPeersSidebar/>
                <BackgroundImageSidebar/>
                <BackgroundColorSidebar/>

                <NotificationsSidebar/>

                <LanguageSidebar/>

                <PrivacySidebar/>
                <ActiveSessionsSidebar/>
                <BlockedUsersSidebar/>

                <CreateChannelSidebar/>

                <SuperSecretSettingsSidebar/>
            </div>
        )
    }
}