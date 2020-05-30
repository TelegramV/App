import UIEvents from "../../../EventBus/UIEvents"
import {AbstractBarComponent} from "../AbstractBarComponent"
import AppEvents from "../../../../Api/EventBus/AppEvents";
import FoldersManager from "../../../../Api/Dialogs/FolderManager";

class LeftBarComponent extends AbstractBarComponent {

    // CRITICAL: always call super
    appEvents(E: AE) {
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

    componentDidMount() {
        super.componentDidMount()
    }
}

export default LeftBarComponent