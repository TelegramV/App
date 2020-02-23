import {EventBus} from "../../Api/EventBus/EventBus"

class UIEventBuses {
    constructor() {
        this.LeftSidebar = new EventBus()
        this.RightSidebar = new EventBus()
        this.Bubbles = new EventBus()
    }
}

const UIEvents = new UIEventBuses()

export default UIEvents