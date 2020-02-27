import VComponent from "../../../../../../../V/VRDOM/component/VComponent"
import AppEvents from "../../../../../../../Api/EventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import VF from "../../../../../../../V/VFramework"
import VUI from "../../../../../../VUI"

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
        VUI.showElement(this.$el)

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
        if (VF.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}`)) {
            console.error("BUG: dialog already rendered")
        } else {
            VRDOM.prepend(<DialogComponent dialog={dialog}/>, this.$el)
        }
    }

    appendDialog = dialog => {
        if (VF.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}`)) {
            console.error("BUG: dialog already rendered")
        } else {
            VRDOM.append(<DialogComponent dialog={dialog}/>, this.$el)
        }
    }

    resort = _ => {
        // ...
    }
}