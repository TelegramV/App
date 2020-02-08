import VComponent from "../../../../../../v/vrdom/component/VComponent"
import AppEvents from "../../../../../../../api/eventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import VF from "../../../../../../v/VFramework"
import DialogsManager from "../../../../../../../api/dialogs/DialogsManager"

export default class ArchivedDialogListComponent extends VComponent {

    identifier = `dialogs-archived-list`

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)
            .on("gotArchived", this.onDialogsGotMany)
            .on("gotNewMany", this.onDialogsGotNewMany)
    }

    h() {
        return (
            <div id="dialogsArchived" className="list"/>
        )
    }

    mounted() {
        DialogsManager.fetchArchivedDialogs().then(dialogs => console.log("archived fetched", dialogs))
    }

    onDialogsGotMany = event => {
        event.dialogs
            .filter(dialog => dialog.isArchived)
            .forEach(this.appendDialog)
    }

    onDialogsGotNewMany = event => {
        event.dialogs
            .filter(dialog => dialog.isArchived)
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
}