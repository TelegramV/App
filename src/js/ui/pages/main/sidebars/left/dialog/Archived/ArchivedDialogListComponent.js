import VComponent from "../../../../../../v/vrdom/component/VComponent"
import AppEvents from "../../../../../../../api/eventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import {Sortable} from "sortablejs"
import VF from "../../../../../../v/VFramework"

export default class ArchivedDialogListComponent extends VComponent {

    identifier = `dialogs-archived-list`

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)
    }

    h() {
        return (
            <div id="dialogsArchived" className="list"/>
        )
    }

    onDialogsGotMany = event => {
        event.dialogs
            .filter(dialog => dialog.isArchived)
            .forEach(this.appendDialog)
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
}