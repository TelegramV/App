import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent";
import VComponent from "../../../../../V/VRDOM/component/VComponent";
import UIEvents from "../../../../EventBus/UIEvents";
import {RecentComponent} from "./RecentComponent";
import {SearchResultsComponent} from "./SearchResultsComponent";
import {CorrespondentsComponent} from "./CorrespondentsComponent";

export class SearchComponent extends StatelessComponent {
    suggestionsRef = VComponent.createRef()
    recentComponentRef = VComponent.createComponentRef()

    appEvents(E) {
        super.appEvents(E)
        E.bus(UIEvents.Sidebars)
            .on("searchInputUpdated", this.onSearchInputUpdated)
    }

    render() {
        return (
            <div class="search hidden" onScroll={this.onScroll}>
                <div ref={this.suggestionsRef} class="suggestions">
                    <CorrespondentsComponent/>
                    <RecentComponent ref={this.recentComponentRef}/>
                </div>
                <SearchResultsComponent/>
            </div>
        )
    }

    open() {
        if (this.recentComponentRef.component) {
            this.recentComponentRef.component.refreshRecent()
        }

        this.$el.classList.remove("hidden")
    }

    close() {
        this.$el.classList.add("hidden");
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
            UIEvents.Sidebars.fire("searchInputNextPage")
        }
    }
}