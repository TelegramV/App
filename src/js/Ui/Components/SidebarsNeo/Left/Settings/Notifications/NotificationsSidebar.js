import {Section} from "../../../Fragments/Section";
import CheckboxButton from "../../../Fragments/CheckboxButton";
import {LeftSidebar} from "../../LeftSidebar";

export class NotificationsSidebar extends LeftSidebar {
    content(): * {
        return <this.contentWrapper>
            <Section title="Private Chats">
                <CheckboxButton checked text="Notifications for private chats" isDescriptionAsState/>
                <CheckboxButton checked text="Message preview" isDescriptionAsState/>
            </Section>


            <Section title="Groups">
                <CheckboxButton checked text="Notifications for groups" isDescriptionAsState/>
                <CheckboxButton text="Message preview" isDescriptionAsState/>
            </Section>


            <Section title="Channels">
                <CheckboxButton checked text="Notifications channels" isDescriptionAsState/>
                <CheckboxButton text="Message preview" isDescriptionAsState/>
            </Section>


            <Section title="Other">
                <CheckboxButton checked text="Contacts joined Telegram"/>
            </Section>
        </this.contentWrapper>
    }

    get title(): string | * {
        return "Notifications"
    }
}