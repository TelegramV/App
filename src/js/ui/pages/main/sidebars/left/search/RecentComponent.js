import VComponent from "../../../../../v/vrdom/component/VComponent"
import {ContactFragment} from "./ContactFragment"
import UIEvents from "../../../../../eventBus/UIEvents"
import {VUI} from "../../../../../v/VUI"

export class RecentComponent extends VComponent {

    appEvents(E) {
        E.bus(UIEvents.LeftSidebar)
            .on("searchInputUpdated", this.onSearchInputUpdated)
    }

    h() {
        return (
            <div className="recent">
                <div className="section-title">Recent</div>
                <div className="column-list">
                    <ContactFragment url={"./static/images/logo.svg"} name={"Doggo"} status={"online"}/>
                    <ContactFragment url={"./static/images/logo.svg"} name={"Doggo"} status={"online"}/>
                    <ContactFragment url={"./static/images/logo.svg"} name={"Doggo"} status={"online"}/>
                    <ContactFragment url={"./static/images/logo.svg"} name={"Doggo"} status={"online"}/>
                    <ContactFragment url={"./static/images/logo.svg"} name={"Doggo"} status={"online"}/>
                </div>
            </div>
        )
    }

    onSearchInputUpdated = (event) => {
        if (event.string.trim() === "") {
            VUI.showElement(this.$el)
        } else {
            VUI.hideElement(this.$el)
        }
    }
}