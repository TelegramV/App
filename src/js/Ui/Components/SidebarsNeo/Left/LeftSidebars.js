import {GenericSidebarHistory} from "../GenericSidebarHistory";
import {SettingsSidebar} from "./Settings/SettingsSidebar";
import {DialogsSidebar} from "./Dialogs/DialogsSidebar";
import {PrivacySidebar} from "./Settings/Privacy/PrivacySidebar";
import {NotificationsSidebar} from "./Settings/Notifications/NotificationsSidebar";
import {LanguageSidebar} from "./Settings/LanguageSidebar";
import {ActiveSessionsSidebar} from "./Settings/Privacy/ActiveSessionsSidebar";
import {BlockedSidebar} from "./Settings/Privacy/BlockedSidebar";
import {GeneralSidebar} from "./Settings/General/GeneralSidebar";
import {ArchivedSidebar} from "./Dialogs/ArchivedSidebar";

export class LeftSidebars extends GenericSidebarHistory {
    render() {
        return (
            <div className="sidebar-wrapper left">

                <DialogsSidebar/>
                <ArchivedSidebar/>

                <SettingsSidebar/>


                <GeneralSidebar/>

                <NotificationsSidebar/>

                <LanguageSidebar/>

                <PrivacySidebar/>
                <ActiveSessionsSidebar/>
                <BlockedSidebar/>
            </div>
        )
    }
}