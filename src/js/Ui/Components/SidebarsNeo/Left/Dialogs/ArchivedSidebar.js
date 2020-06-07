import {LeftSidebar} from "../LeftSidebar";
import VSimpleLazyInput from "../../../../Elements/Input/VSimpleLazyInput";
import DialogsManager from "../../../../../Api/Dialogs/DialogsManager";
import {UnpatchableLeftSidebar} from "../UnpatchableLeftSidebar";

export class ArchivedSidebar extends UnpatchableLeftSidebar {
    content(): * {
        return <this.contentWrapper>
            тут будуть архівовані діалоги
        </this.contentWrapper>
    }


    get title(): string | * {
        return "Archived Chats"
    }

    get headerBorder(): boolean {
        return false
    }
}