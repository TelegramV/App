import {LeftSidebar} from "../LeftSidebar";
import VSimpleLazyInput from "../../../../Elements/Input/VSimpleLazyInput";
import DialogsManager from "../../../../../Api/Dialogs/DialogsManager";
import {UnpatchableLeftSidebar} from "../UnpatchableLeftSidebar";
import ArchivedDialogListComponent from "./Lists/ArchivedDialogListComponent";
import {IS_MOBILE_SCREEN} from "../../../../../Utils/browser";
import AppSelectedChat from "../../../../Reactive/SelectedChat";
import UIEvents from "../../../../EventBus/UIEvents";
import type {AE} from "../../../../../V/VRDOM/component/__component_appEventsBuilder";
import PinnedDialogListComponent from "./Lists/PinnedDialogListComponent";
import VirtualDialogsFolderList from "./VirtualDialogsFolderList";
import VComponent from "../../../../../V/VRDOM/component/VComponent";

export class ArchivedSidebar extends LeftSidebar {
    virtualFolderList = VComponent.createComponentRef()

    content(): * {
        return <this.contentWrapper>
            <div style={{
                "height": "100%"
            }}>
                <VirtualDialogsFolderList archived ref={this.virtualFolderList}/>
            </div>
       </this.contentWrapper>
    }

    appEvents(E: AE) {
        super.appEvents(E);

        E.bus(UIEvents.General)
            .on("chat.select", this.onChatSelect)
    }

    componentDidMount() {
        DialogsManager.fetchArchivedDialogs()
    }

    onShown(params) {
        super.onShown(params);
        this.virtualFolderList.component.fastVirtualListRef.component.calculate()
        this.virtualFolderList.component.fastVirtualListRef.component.forceUpdate()
    }

    onChatSelect = _ => {
        if(IS_MOBILE_SCREEN) {
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