import {Section} from "../../../Fragments/Section";
import Hint from "../../../Fragments/Hint";
import AvatarButton from "../../../Fragments/AvatarButton";
import PeersStore from "../../../../../../Api/Store/PeersStore";
import {LeftSidebar} from "../../LeftSidebar";

export class BlockedSidebar extends LeftSidebar {
    content(): * {
        return <this.contentWrapper>
            {/*TODO move Hint to Section?*/}
            <Hint>Blocked users will not be able to contact you and will not see your Last Seen time.</Hint>
            <Section>
                <AvatarButton peer={PeersStore.self()} isNameAsText isNumberAsDescription/>
            </Section>

        </this.contentWrapper>
    }

    onFloatingActionButtonPressed = () => {
    }

    get floatingActionButtonIcon(): string | null {
        return "add"
    }

    get title(): string | * {
        return "Blocked Users"
    }
}