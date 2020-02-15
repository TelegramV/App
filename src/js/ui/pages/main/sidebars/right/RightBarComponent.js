import UIEvents from "../../../../eventBus/UIEvents"
import {AbstractBarComponent} from "../AbstractBarComponent"

export class RightBarComponent extends AbstractBarComponent {

    hidden = true
    // CRITICAL: always call super
    appEvents(E) {
        E.bus(UIEvents.RightSidebar)
            .on("show", this.sidebarOnShow)
            .on("hide", this.sidebarOnHide)
    }

    openBar = barName => {
        if(this.hidden) {
            UIEvents.RightSidebar.fire("show", {
                barName: barName || this.barName
            })
            this.hidden = false
        }
    }

    hideBar = barName => {
        if(!this.hidden) {
            UIEvents.RightSidebar.fire("hide", {
                barName: barName || this.barName
            })
            this.hidden = true
        }
    }
}