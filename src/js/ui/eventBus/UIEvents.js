import {EventBus} from "../../api/eventBus/EventBus"

class UIEventBuses {
    constructor() {
        this.LeftSidebar = new EventBus()
        this.RightSidebar = new EventBus()
    }
}

const UIEvents = new UIEventBuses()

export default UIEvents