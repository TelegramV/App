import UIEvents from "../../../EventBus/UIEvents"
import {AbstractBarComponent} from "../AbstractBarComponent"

export class OnTopRightBarComponent extends AbstractBarComponent {

    hidden = true

    // CRITICAL: always call super
    appEvents(E) {
        E.bus(UIEvents.RightSidebar)
            .on("showOnTop", this.sidebarOnShow)
            .on("hideOnTop", this.sidebarOnHide)
    }

    openBar = barName => {
        UIEvents.RightSidebar.fire("showOnTop", {
            barName: barName || this.barName,
        })
    }

    hideBar = barName => {
        if(!this.barVisible) return
        UIEvents.RightSidebar.fire("hideOnTop", {
            barName: barName || this.barName,
        })
    }
}