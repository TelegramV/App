import {LeftBarComponent} from "../LeftBarComponent"
import {CorrespondentsComponent} from "./CorrespondentsComponent"
import {RecentComponent} from "./RecentComponent"
import {SearchResultsComponent} from "./SearchResultsComponent"
import UIEvents from "../../../../../eventBus/UIEvents"

export class SearchPanelComponent extends LeftBarComponent {

    barName = "search"
    barVisible = false

    h() {
        return (
            <div class="sidebar scrollable search hidden" onScroll={this.onScroll}>
                <div class="suggestions">
                    <CorrespondentsComponent/>
                    <RecentComponent/>
                </div>
                <SearchResultsComponent/>
            </div>
        )
    }

    onScroll = event => {
        const $element = event.target

        if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop) {
            UIEvents.LeftSidebar.fire("searchInputNextPage")
        }
    }

    barOnShow = () => {
        this.$el.classList.remove("hidden");
    }

    barOnHide = () => {
        this.$el.classList.add("hidden");
    }
}