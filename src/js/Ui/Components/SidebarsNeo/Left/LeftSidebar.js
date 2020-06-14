import "./LeftSidebar.scss"
import {GenericSidebar} from "../GenericSidebar";
import {RightSidebar} from "../Right/RightSidebar";

export class LeftSidebar extends GenericSidebar {
    get classes() {
        const c = super.classes
        c.push("left")
        return c
    }

    pop(from) {
        const type = this.history[this.history.length - 1]
        if (type === from || type === from.constructor || from === LeftSidebar) {
            super.pop(from)
        }
    }
}