import {Section} from "../../../Fragments/Section";
import IconButton from "../../../Fragments/IconButton";
import Button from "../../../Fragments/Button";
import {LeftSidebar} from "../../LeftSidebar";
import {ActiveSessionsSidebar} from "./ActiveSessionsSidebar"
import UIEvents from "../../../../../EventBus/UIEvents";

export class PrivacySidebar extends LeftSidebar {
    content(): * {
        return <this.contentWrapper>
            <Section>
                <IconButton icon="deleteuser" text="Blocked Users" description="6 users"/>
                <IconButton icon="activesessions" 
                            text="Active Sessions" 
                            description="3 devices" 
                            onClick={() => UIEvents.Sidebars.fire("push", ActiveSessionsSidebar)}/>
            </Section>


            <Section title="Privacy">
                <Button text="Who can see my phone number?" description="My Contacts"/>
                <Button text="Who can see your Last Seen time?" description="Everybody"/>
                <Button text="Who can see my profile photo?" description="Everybody"/>
                <Button text="Who can add a link to my account when forwarding my messages?" description="Everybody"/>
                <Button text="Who can add me to group chats?" description="Everybody"/>
            </Section>
        </this.contentWrapper>
    }

    get title(): string | * {
        return "Privacy and Security"
    }
}