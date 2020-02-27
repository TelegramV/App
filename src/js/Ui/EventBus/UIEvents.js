import {EventBus} from "../../Api/EventBus/EventBus"

const UIEvents = {
    General: new EventBus(),
    LeftSidebar: new EventBus(),
    RightSidebar: new EventBus(),
    Bubbles: new EventBus(),
}

export default UIEvents