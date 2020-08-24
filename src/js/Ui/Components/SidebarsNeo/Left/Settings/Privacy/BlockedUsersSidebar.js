import {Section} from "../../../Fragments/Section";
import Hint from "../../../Fragments/Hint";
import AvatarButton from "../../../Fragments/AvatarButton";
import PeersStore from "../../../../../../Api/Store/PeersStore";
import {LeftSidebar} from "../../LeftSidebar";
import BlockedManager from "../../../../../../Api/Contacts/BlockedManager"
import "./BlockedUsersSidebar.scss"
import VUI from "../../../../../VUI"
import Locale from "../../../../../../Api/Localization/Locale"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"

export class BlockedUsersSidebar extends LeftSidebar {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .updateOn("contacts.blocked")
    }

    content(): * {
        return <this.contentWrapper>
            <div class="blocked-users">
                <Section>
                    <Hint>Blocked users will not be able to contact you and will not see your Last Seen time.</Hint>
                    {BlockedManager.getBlocked().map(peer => <AvatarFragment peer={peer} onContextClick={() => this.unblock(peer)}/>)}
                </Section>
            </div>

        </this.contentWrapper>
    }

    onShown() {
        this.forceUpdate();
    }

    unblock = (peer) => {
        BlockedManager.unblock(peer);
    }

    onFloatingActionButtonPressed = () => {
    }

    get floatingActionButtonIcon(): string | null {
        return "add"
    }

    get title(): string | * {
        return this.l("lng_blocked_list_title")
    }
}

const AvatarFragment = ({peer, onContextClick}) => {
    const contextMenuActions = [
        {
            icon: "unlock",
            title: Locale.l("lng_blocked_list_unblock"),
            onClick: onContextClick
        }
    ]

    return <AvatarButton peer={peer} 
                        isNameAsText 
                        isNumberAsDescription 
                        onClick={VUI.ContextMenu.listener(contextMenuActions)} 
                        onContextMenu={VUI.ContextMenu.listener(contextMenuActions)}/>
}