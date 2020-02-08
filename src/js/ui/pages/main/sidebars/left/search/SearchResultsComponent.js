import VComponent from "../../../../../v/vrdom/component/VComponent"
import UIEvents from "../../../../../eventBus/UIEvents"
import {VUI} from "../../../../../v/VUI"
import {GlobalChatsSearchComponent} from "./GlobalChatsSearchComponent"
import {GlobalMessagesSearchComponent} from "./GlobalMessagesSearchComponent"

export class SearchResultsComponent extends VComponent {

    appEvents(E) {
        E.bus(UIEvents.LeftSidebar)
            .on("searchInputUpdated", this.onSearchInputUpdated)
    }

    h() {
        return (
            <div class="search-results hidden">
                <GlobalChatsSearchComponent/>
                <GlobalMessagesSearchComponent/>
            </div>
        )
    }

    onSearchInputUpdated = event => {
        if (event.string.trim() === "") {
            VUI.hideElement(this.$el)
        } else {
            VUI.showElement(this.$el)
        }
    }
}