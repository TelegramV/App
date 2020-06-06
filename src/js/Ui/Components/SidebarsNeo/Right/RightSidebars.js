import {GenericSidebarHistory} from "../GenericSidebarHistory";
import {BlockedSidebar} from "../Left/Settings/Privacy/BlockedSidebar";

export class RightSidebars extends GenericSidebarHistory {
    render() {
        return (
            <div className="sidebar-wrapper right">

                <BlockedSidebar/>
            </div>
        )
    }

    pop = () => {
        super.pop()
        // TODO last bar should close with other animation
    }
}