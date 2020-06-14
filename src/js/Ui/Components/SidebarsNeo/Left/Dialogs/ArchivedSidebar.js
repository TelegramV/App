import {LeftSidebar} from "../LeftSidebar";
import VSimpleLazyInput from "../../../../Elements/Input/VSimpleLazyInput";
import DialogsManager from "../../../../../Api/Dialogs/DialogsManager";
import {UnpatchableLeftSidebar} from "../UnpatchableLeftSidebar";
import ArchivedDialogListComponent from "./Lists/ArchivedDialogListComponent";

export class ArchivedSidebar extends UnpatchableLeftSidebar {
    content(): * {
        return <this.contentWrapper>
            <ArchivedDialogListComponent/>
       </this.contentWrapper>
    }


    get title(): string | * {
        return "Archived Chats"
    }

    get headerBorder(): boolean {
        return false
    }
}