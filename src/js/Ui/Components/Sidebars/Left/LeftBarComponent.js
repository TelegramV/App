import UIEvents from "../../../EventBus/UIEvents"
import {AbstractBarComponent} from "../AbstractBarComponent"

class LeftBarComponent extends AbstractBarComponent {

    // CRITICAL: always call super
    appEvents(E) {
        E.bus(UIEvents.LeftSidebar)
            .on("show", this.sidebarOnShow)
    }

    openBar = barName => {
        UIEvents.LeftSidebar.fire("show", {
            barName
        })
    }
}

export default LeftBarComponent