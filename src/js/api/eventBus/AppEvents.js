import {EventBus} from "./EventBus"
import {DialogsEventBus} from "./DialogsEventBus"
import {PeersEventBus} from "./PeersEventBus"
import {MessagesEventBus} from "./MessagesEventBus"

class AppEventBus {

    Dialogs

    constructor() {
        this.Dialogs = new DialogsEventBus()
        this.Peers = new PeersEventBus()
        this.Messages = new EventBus()
        this.General = new MessagesEventBus()
    }
}

const AppEvents = new AppEventBus()

export default AppEvents