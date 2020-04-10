import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import VApp from "../../../../../../V/vapp"

export default class PinnedDialogListComponent extends VComponent {

    identifier = `dialogs-pinned-list`

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)
            .on("gotNewMany", this.onDialogsGotNewMany)
    }

    render() {
        return (
            <div id="dialogsPinned" className="list pinned hidden"/>
        )
    }

    componentDidMount() {
        // Sortable.create(this.$el)
    }

    onDialogsGotMany = event => {
        $(this.$el).show()

        event.dialogs
            .filter(dialog => dialog.isPinned)
            .forEach(this.appendDialog)
    }

    onDialogsGotNewMany = event => {
        event.dialogs
            .filter(dialog => dialog.isPinned)
            .forEach(this.prependDialog)
    }

    prependDialog = dialog => {
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}`)) {
            console.error("BUG: dialog already rendered")
        } else {
            VRDOM.prepend(<DialogComponent dialog={dialog}/>, this.$el)
        }
    }

    appendDialog = dialog => {
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}`)) {
            console.error("BUG: dialog already rendered")
        } else {
            VRDOM.append(<DialogComponent dialog={dialog}/>, this.$el)
        }
    }

    resort = _ => {
        // ...
    }
}