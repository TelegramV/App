import UIEvents from "../../../../eventBus/UIEvents"
import {AbstractBarComponent} from "../AbstractBarComponent"

export class RightBarComponent extends AbstractBarComponent {

    // CRITICAL: always call super
    appEvents(E) {
        E.bus(UIEvents.RightSidebar)
            .on("show", this.sidebarOnShow)
    }

    openBar = barName => {
        UIEvents.RightSidebar.fire("show", {
            barName
        })
    }
}