import {LeftSidebar} from "../LeftSidebar";
import VSimpleLazyInput from "../../../../Elements/Input/VSimpleLazyInput";
import DialogsManager from "../../../../../Api/Dialogs/DialogsManager";
import {UnpatchableLeftSidebar} from "../UnpatchableLeftSidebar";
import ArchivedDialogListComponent from "./Lists/ArchivedDialogListComponent";
import {isMobile} from "../../../../Utils/utils";
import AppSelectedChat from "../../../../Reactive/SelectedChat";
import UIEvents from "../../../../EventBus/UIEvents";
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import PinnedDialogListComponent from "./Lists/PinnedDialogListComponent";

export class ArchivedSidebar extends UnpatchableLeftSidebar {
    content(): * {
        return <this.contentWrapper>
            <div>
                <PinnedDialogListComponent folderId="archive"/>
                <ArchivedDialogListComponent/>
            </div>
       </this.contentWrapper>
    }

    appEvents(E: AE) {
        super.appEvents(E);

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
    }

    onChatSelect = _ => {
        if(isMobile()) {
            if (AppSelectedChat.isSelected && !this.$el.classList.contains("hidden")) {
                console.log("fade out")
                this.fadeOut()
                // this.$el.classList.add("fade-out")
            } else if(this.$el.classList.contains("fade-out")) {
                console.log("show")

                this.show()
                // this.$el.classList.remove("responsive-selected-chatlist")
            }
        }
    }


    get title(): string | * {
        return this.l("lng_archived_name")
    }

    get headerBorder(): boolean {
        return false
    }
}