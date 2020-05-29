import {EventBus} from "./EventBus"
import {DialogsEventBus} from "./DialogsEventBus"
import {PeersEventBus} from "./PeersEventBus"

const AppEvents = {
    // we should leave a single bus,
    General: new EventBus(),

    Dialogs: new DialogsEventBus(),
    Peers: new PeersEventBus(),
    Calls: new EventBus(),
    Files: new EventBus()
}

export default AppEvents