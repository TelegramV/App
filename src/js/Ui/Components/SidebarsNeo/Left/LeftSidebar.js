import "./LeftSidebar.scss"
import {GenericSidebar} from "../GenericSidebar";

export class LeftSidebar extends GenericSidebar {
    get classes() {
        const c = super.classes
        c.push("left")
        return c
    }
}