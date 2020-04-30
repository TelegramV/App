import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import DialogsManager from "../../../../../../Api/Dialogs/DialogsManager"
import VApp from "../../../../../../V/vapp"

export default class ArchivedDialogListComponent extends VComponent {

    identifier = `dialogs-archived-list`

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)
            .on("gotArchived", this.onDialogsGotMany)
            .on("gotNewMany", this.onDialogsGotNewMany)
    }

    render() {
        return (
            <div id="dialogsArchived" className="list"/>
        )
    }

    componentDidMount() {
        DialogsManager.fetchArchivedDialogs()
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
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-archive`)) {
            // Normal behaviour, not an error
            // console.error("BUG: dialog already rendered", dialog.peer.name, this.props.folder)
        } else {
            VRDOM.prepend(<DialogComponent dialog={dialog} folderId={"archive"} list={this}/>, this.$el)
        }
    }

    appendDialog = dialog => {
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-archive`)) {
            // Normal behaviour, not an error
            // console.error("BUG: dialog already rendered", dialog.peer.name, this.props.folder)
        } else {
            VRDOM.append(<DialogComponent dialog={dialog} folderId={"archive"} list={this}/>, this.$el)
        }
    }
}