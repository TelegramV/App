import {Section} from "../../../Fragments/Section";
import IconButton from "../../../Fragments/IconButton";
import Button from "../../../Fragments/Button";
import {LeftSidebar} from "../../LeftSidebar";
import {ActiveSessionsSidebar} from "./ActiveSessionsSidebar"
import {BlockedUsersSidebar} from "./BlockedUsersSidebar"
import UIEvents from "../../../../../EventBus/UIEvents";
import API from "../../../../../../Api/Telegram/API"
import BlockedManager from "../../../../../../Api/Contacts/BlockedManager"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"

export class PrivacySidebar extends LeftSidebar {

    state = {
        activeSessionsCount: 0
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .updateOn("contacts.blocked")
    }

    content(): * {
        return <this.contentWrapper>
            <Section>
                <IconButton icon="deleteuser" 
                            text={this.l("lng_blocked_list_title")}
                            description={`${BlockedManager.getTotalCount()} users`} 
                            onClick={() => UIEvents.Sidebars.fire("push", BlockedUsersSidebar)}/>
                <IconButton icon="activesessions" 
                            text={this.l("lng_settings_sessions_title")} 
                            description={`${this.state.activeSessionsCount} devices`} 
                            onClick={() => UIEvents.Sidebars.fire("push", ActiveSessionsSidebar)}/>
            </Section>


            <Section title={this.l("lng_settings_privacy_title")}>
                <Button text="Who can see my phone number?" description="My Contacts"/>
                <Button text="Who can see your Last Seen time?" description="Everybody"/>
                <Button text="Who can see my profile photo?" description="Everybody"/>
                <Button text="Who can add a link to my account when forwarding my messages?" description="Everybody"/>
                <Button text="Who can add me to group chats?" description="Everybody"/>
            </Section>
        </this.contentWrapper>
    }

    onShown() {
        API.account.getAuthorizations().then(list => {
            this.setState({
                activeSessionsCount: list.authorizations.length
            })
        })
    }

    get title(): string | * {
        return this.l("lng_settings_section_privacy")
    }
}