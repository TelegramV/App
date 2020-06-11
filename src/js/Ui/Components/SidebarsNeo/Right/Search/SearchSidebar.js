import {RightSidebar} from "../RightSidebar";

export class SearchSidebar extends RightSidebar {

    content(): * {
        return <this.contentWrapper>
            lol
        </this.contentWrapper>
    }

    get title(): string | * {
        return "Info"
    }
}