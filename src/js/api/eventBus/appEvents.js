import {EventBus} from "./index"

class AppEventBus {
    constructor(props) {
        this.Dialogs = new EventBus()
        this.Peers = new EventBus()
    }
}

const AppEvents = new AppEventBus()

export default AppEvents