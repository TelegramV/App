import {EventBus} from "./EventBus"
import {DialogsEventBus} from "./DialogsEventBus"
import {PeersEventBus} from "./PeersEventBus"
import {MessagesEventBus} from "./MessagesEventBus"

const AppEvents = {
    Dialogs: new DialogsEventBus(),
    Peers: new PeersEventBus(),
    Messages: new EventBus(),
    General: new MessagesEventBus(),
    Calls: new EventBus(),
}

export default AppEvents