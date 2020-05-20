import UIEvents from "../../../../EventBus/UIEvents"
import {GlobalChatsSearchComponent} from "./GlobalChatsSearchComponent"
import {GlobalMessagesSearchComponent} from "./GlobalMessagesSearchComponent"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"

export class SearchResultsComponent extends StatelessComponent {

    appEvents(E) {
        E.bus(UIEvents.LeftSidebar)
            .on("searchInputUpdated", this.onSearchInputUpdated)
    }

    render() {
        return (
            <div class="search-results hidden">
                <GlobalChatsSearchComponent/>
                <GlobalMessagesSearchComponent/>
            </div>
        )
    }

    onSearchInputUpdated = event => {
        if (event.string.trim() === "") {
            $(this.$el).hide()
        } else {
            $(this.$el).show()
        }
    }
}