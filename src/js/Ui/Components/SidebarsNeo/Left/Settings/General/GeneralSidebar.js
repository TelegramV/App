import {Section} from "../../../Fragments/Section";
import IconButton from "../../../Fragments/IconButton";
import CheckboxButton from "../../../Fragments/CheckboxButton";
import {RadioSection} from "../../../Fragments/RadioSection";
import {LeftSidebar} from "../../LeftSidebar";
import VSlider from "../../../../../Elements/Input/VSlider";
import {BackgroundImageSidebar} from "./Background/BackgroundImageSidebar"
import UIEvents from "../../../../../EventBus/UIEvents";
import VInput from "../../../../../Elements/Input/VInput";
import keval from "../../../../../../Keval/keval";
import Hint from "../../../Fragments/Hint";

export class GeneralSidebar extends LeftSidebar {
    state = {
        phoneCallsBridge: "wss://undrfin.de:19133"
    }

    init() {
        super.init();
        keval.getItem("phoneCallsBridge").then(l => {
            this.setState({
                phoneCallsBridge: l || "wss://undrfin.de:19133"
            })
        })
    }

    content(): * {
        return <this.contentWrapper>
            <Section title={this.l("lng_menu_settings")}>
                <VSlider label="Message Text Size" value={16} max={22} min={10}/>
                <IconButton icon="photo" text={this.l("lng_settings_section_background")}
                            onClick={_ => UIEvents.Sidebars.fire("push", BackgroundImageSidebar)}/>
                <CheckboxButton checked text={this.l("lng_settings_enable_animations")}/>
                <VInput label="Phone calls bridge" value={this.state.phoneCallsBridge}
                        onInput={this.changePhoneCallsBridge}/>
                <Hint>Currently phone calls can only be used with either TCP or UDP protocol. In web we can't use neither of these,
                    so client needs to establish connection with websocket2tcp bridge. All the crypto happens on the client,
                    the bridge can only see encrypted data.</Hint>
            </Section>

            <RadioSection title="Keyboard" radios={[
                {
                    text: "Send by Enter",
                    description: "New line by Shift + Enter",
                    onClick: _ => {
                    }
                },
                {
                    text: "Send by Ctrl + Enter",
                    description: "New line by Enter",
                    checked: true,
                    onClick: _ => {
                    }
                },
            ]}/>

            <Section title={this.l("lng_media_auto_settings")}>
                <CheckboxButton checked text="Contacts"/>
                <CheckboxButton checked text="Private Chats"/>
                <CheckboxButton checked text="Group Chats"/>
                <CheckboxButton checked text="Channels"/>
            </Section>

            <Section title={this.l("lng_media_auto_play")}>
                <CheckboxButton checked text="GIFs"/>
                <CheckboxButton checked text="Videos"/>
            </Section>


            <Section title="Stickers">
                <CheckboxButton checked text="Suggest Stickers by Emoji"/>
                <CheckboxButton checked text="Loop Animated Stickers"/>

            </Section>
        </this.contentWrapper>
    }

    changePhoneCallsBridge = (event) => {
        this.setState({
            phoneCallsBridge: event.target.value
        })
        keval.setItem("phoneCallsBridge", event.target.value)
    }

    get title(): string | * {
        return this.l("lng_settings_section_general")
    }
}