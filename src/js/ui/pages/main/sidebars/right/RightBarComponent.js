import UIEvents from "../../../../eventBus/UIEvents"
import {AbstractBarComponent} from "../AbstractBarComponent"

export class RightBarComponent extends AbstractBarComponent {

    // CRITICAL: always call super
    appEvents(E) {
        E.bus(UIEvents.RightSidebar)
            .on("show", this.sidebarOnShow)
            .on("hide", this.sidebarOnHide)
    }

    openBar = barName => {
        UIEvents.RightSidebar.fire("show", {
            barName: barName || this.barName
        })
    }

    hideBar = barName => {
        UIEvents.RightSidebar.fire("hide", {
            barName: barName || this.barName
        })
    }
}