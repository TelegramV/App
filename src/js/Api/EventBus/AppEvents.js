import {EventBus} from "./EventBus"

const AppEvents = {
    // we should leave a single bus,
    General: new EventBus(),
    Telegram: new EventBus(),
    Audio: new EventBus(),

    Dialogs: new EventBus(),
    Peers: new EventBus(),
    Messages: new EventBus(),
    Calls: new EventBus(),
    Files: new EventBus()
}

export default AppEvents