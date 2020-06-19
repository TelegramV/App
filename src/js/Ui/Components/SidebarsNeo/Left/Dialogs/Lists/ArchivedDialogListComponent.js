import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import DialogsManager from "../../../../../../Api/Dialogs/DialogsManager"
import VApp from "../../../../../../V/vapp"
import {vrdom_resolveMount} from "../../../../../../V/VRDOM/mount";
import StatelessComponent from "../../../../../../V/VRDOM/component/StatelessComponent"

export default class ArchivedDialogListComponent extends StatelessComponent {

    identifier = `dialogs-archived-list`

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)
            .on("gotArchived", this.onDialogsGotMany)
            .on("gotNewMany", this.onDialogsGotNewMany)
            .on("gotOne", this.onDialogsGotOne)

    }

    render() {
        return (
            <div id="dialogsArchived" className="list archive"/>
        )
    }

    componentDidMount() {
        DialogsManager.fetchArchivedDialogs()
    }

    _findRenderedDialogToInsertBefore = (dialog) => {
        const $dialogs = this.$el
        if (!dialog.messages.last) {
            return undefined
        }

        const renderedDialogs = $dialogs.childNodes

        if (renderedDialogs.size === 0) {
            return undefined
        }

        const lastMessageDate = dialog.peer.messages.last.date

        for (const $rendered of renderedDialogs) {
            if ($rendered !== this.$el) {
                if ($rendered.__message && lastMessageDate >= $rendered.__message.date) {
                    return $rendered // todo: fix if dialog is last in the list
                }
            }
        }

        return undefined
    }

    onDialogsGotOne = event => {
        const dialog = event.dialog
        if (!dialog.isArchived || dialog.isPinned) return
        const $insertBefore = this._findRenderedDialogToInsertBefore(dialog)
        this.insertBeforeDialog(dialog, $insertBefore)

    }

    onDialogsGotMany = event => {
        event.dialogs
            .filter(dialog => dialog.isArchived && !dialog.isPinned)
            .forEach(this.appendDialog)
    }

    onDialogsGotNewMany = event => {
        event.dialogs
            .filter(dialog => dialog.isArchived && !dialog.isPinned)
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

    insertBeforeDialog = (dialog, $el) => {
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-archive`)) {
            // Normal behaviour, not an error
            // console.error("BUG: dialog already rendered", dialog.peer.name, this.props.folder)
        } else {
            const c = VRDOM.render(<DialogComponent dialog={dialog} folderId={"archive"} list={this}/>)
            this.$el.insertBefore(c, $el)
            vrdom_resolveMount(c)
        }
    }
}