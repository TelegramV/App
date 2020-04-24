import UIEvents from "../../../EventBus/UIEvents"
import {AbstractBarComponent} from "../AbstractBarComponent"

class LeftBarComponent extends AbstractBarComponent {

    // CRITICAL: always call super
    appEvents(E) {
        E.bus(UIEvents.LeftSidebar)
            .on("show", this.sidebarOnShow)
            .on("hide", this.sidebarOnHide)
    }

    openBar = barName => {
        UIEvents.LeftSidebar.fire("show", {
            barName
        })
    }

    hideBar = barName => {
        UIEvents.LeftSidebar.fire("hide", {
            barName
        })
    }
}

export default LeftBarComponent