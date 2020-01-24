import {EventBus} from "./EventBus"
import {DialogsEventBus} from "./DialogsEventBus"
import {PeersEventBus} from "./PeersEventBus"

class AppEventBus {
    constructor(props) {
        this.Dialogs = new DialogsEventBus()
        this.Peers = new PeersEventBus()
        this.General = new EventBus()
    }
}

const AppEvents = new AppEventBus()

export default AppEvents