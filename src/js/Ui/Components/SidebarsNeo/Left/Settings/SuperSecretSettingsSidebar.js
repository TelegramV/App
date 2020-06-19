import {LeftSidebar} from "../LeftSidebar";
import {Section} from "../../Fragments/Section";
import IconButton from "../../Fragments/IconButton";

export class SuperSecretSettingsSidebar extends LeftSidebar {
    content(): * {
        return <this.contentWrapper>
            <Section>
                <IconButton icon="avatar_deletedaccount" text="RIP filter" description="For those who will lose cause of bundle size (me)" onClick={this.ripFilter}/>
            </Section>
        </this.contentWrapper>
    }

    ripFilter = () => {
        document.querySelector("body").classList.add("rip")
    }

    get title(): string | * {
        return "Super Secret Settings"
    }
}