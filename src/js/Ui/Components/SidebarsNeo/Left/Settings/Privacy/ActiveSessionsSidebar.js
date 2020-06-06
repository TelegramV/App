import {Section} from "../../../Fragments/Section";
import IconButton from "../../../Fragments/IconButton";
import Button from "../../../Fragments/Button";
import AppConfiguration from "../../../../../../Config/AppConfiguration";
import {LeftSidebar} from "../../LeftSidebar";

export class ActiveSessionsSidebar extends LeftSidebar {
    content(): * {
        const appName = "Telegram V " + AppConfiguration.mtproto.api.app_version
        const browser = "Netspace Navigator"
        const location = "216.3.128.12 - Paris, France"

        return <this.contentWrapper>
            <Section title="Current Session">
                <Button text={appName} subtext={browser} description={location}/>
                <IconButton icon="stop" text="Terminate all other sessions" red/>
            </Section>


            <Section title="Other Sessions">
                <Button text={appName} subtext={browser} description={location} right={<div className="time">12:00</div>}/>
            </Section>
        </this.contentWrapper>
    }

    get title(): string | * {
        return "Privacy and Security"
    }
}