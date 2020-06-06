import {LeftSidebar} from "../LeftSidebar";
import VSimpleLazyInput from "../../../../Elements/Input/VSimpleLazyInput";
import DialogsManager from "../../../../../Api/Dialogs/DialogsManager";

export class ArchivedSidebar extends LeftSidebar {
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