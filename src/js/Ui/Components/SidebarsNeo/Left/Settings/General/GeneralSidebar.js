import {Section} from "../../../Fragments/Section";
import IconButton from "../../../Fragments/IconButton";
import CheckboxButton from "../../../Fragments/CheckboxButton";
import {RadioSection} from "../../../Fragments/RadioSection";
import {LeftSidebar} from "../../LeftSidebar";
import VSlider from "../../../../../Elements/Input/VSlider";
import {BackgroundImageSidebar} from "./Background/BackgroundImageSidebar"
import UIEvents from "../../../../../EventBus/UIEvents";

export class GeneralSidebar extends LeftSidebar {
    content(): * {
        return <this.contentWrapper>
            <Section title="Settings">
                <VSlider label="Message Text Size" value={16} max={22} min={10}/>
                <IconButton icon="photo" text="Chat Background" onClick={_ => UIEvents.Sidebars.fire("push", BackgroundImageSidebar)}/>
                <CheckboxButton checked text="Enable Animations"/>
            </Section>

            <RadioSection title="Keyboard" radios={[
                {
                    text: "Send by Enter",
                    description: "New line by Shift + Enter",
                    onClick: _ => {}
                },
                {
                    text: "Send by Ctrl + Enter",
                    description: "New line by Enter",
                    checked: true,
                    onClick: _ => {}
                },
            ]}/>

            <Section title="Auto-Download Media">
                <CheckboxButton checked text="Contacts"/>
                <CheckboxButton checked text="Private Chats"/>
                <CheckboxButton checked text="Group Chats"/>
                <CheckboxButton checked text="Channels"/>
            </Section>

            <Section title="Auto-Play Media">
                <CheckboxButton checked text="GIFs"/>
                <CheckboxButton checked text="Videos"/>
            </Section>


            <Section title="Stickers">
                <CheckboxButton checked text="Suggest Stickers by Emoji"/>
                <CheckboxButton checked text="Loop Animated Stickers"/>

            </Section>
        </this.contentWrapper>
    }

    get title(): string | * {
        return "General"
    }
}