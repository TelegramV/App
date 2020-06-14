import LeftBarComponent from "../LeftBarComponent"
import {CorrespondentsComponent} from "./CorrespondentsComponent"
import {RecentComponent} from "./RecentComponent"
import {SearchResultsComponent} from "./SearchResultsComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import VComponent from "../../../../../V/VRDOM/component/VComponent"

export class SearchPanelComponent extends LeftBarComponent {

    barName = "search"
    barVisible = false

    suggestionsRef = VComponent.createRef()
    recentComponentRef = VComponent.createComponentRef()

    appEvents(E) {
        super.appEvents(E)
        E.bus(UIEvents.LeftSidebar)
            .on("searchInputUpdated", this.onSearchInputUpdated)
    }

    render() {
        return (
            <div class="sidebar scrollable search" onScroll={this.onScroll}>
                <div ref={this.suggestionsRef} class="suggestions">
                    <CorrespondentsComponent/>
                    <RecentComponent ref={this.recentComponentRef}/>
                </div>
                <SearchResultsComponent/>
            </div>
        )
    }

    onSearchInputUpdated = event => {
        if (event.string.trim() === "") {
            this.suggestionsRef.show()
        } else {
            this.suggestionsRef.hide()
        }
    }

    onScroll = event => {
        const $element = event.target

        if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop) {
            UIEvents.LeftSidebar.fire("searchInputNextPage")
        }
    }

    barOnShow = () => {
        if (this.recentComponentRef.component) {
            this.recentComponentRef.component.refreshRecent()
        }

        this.$el.classList.remove("hidden")
    }

    barOnHide = () => {
        this.$el.classList.add("hidden");
    }
}