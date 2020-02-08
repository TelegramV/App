import {LeftBarComponent} from "../LeftBarComponent"
import {CorrespondentsComponent} from "./CorrespondentsComponent"
import {RecentComponent} from "./RecentComponent"
import {SearchResultsComponent} from "./SearchResultsComponent"

export class SearchPanelComponent extends LeftBarComponent {

    barName = "search"
    barVisible = false

    h() {
        return (
            <div class="sidebar scrollable search hidden">
                <div class="suggestions">
                    <CorrespondentsComponent/>
                    <RecentComponent/>
                </div>
                <SearchResultsComponent/>
            </div>
        )
    }

    barOnShow = () => {
        this.$el.classList.remove("hidden");
    }

    barOnHide = () => {
        this.$el.classList.add("hidden");
    }
}