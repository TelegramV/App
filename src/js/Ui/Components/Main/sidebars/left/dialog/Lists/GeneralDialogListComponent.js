import VComponent from "../../../../../../../V/VRDOM/component/VComponent"
import AppEvents from "../../../../../../../Api/EventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import VF from "../../../../../../../V/VFramework"
import VUI from "../../../../../../VUI"
import {GroupForbiddenPeer} from "../../../../../../../Api/Peers/Objects/GroupForbiddenPeer"
import {ChannelForbiddenPeer} from "../../../../../../../Api/Peers/Objects/ChannelForbiddenPeer"

export default class GeneralDialogListComponent extends VComponent {

    identifier = `dialogs-general-list`

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)
            .on("gotNewMany", this.onDialogsGotNewMany)
    }

    render() {
        return (
            <div id="dialogs" className="list hidden"/>
        )
    }

    onDialogsGotMany = event => {
        VUI.showElement(this.$el)

        event.dialogs
            .filter(dialog => !dialog.isPinned && !dialog.folderId)
            .forEach(this.appendDialog)
    }

    onDialogsGotNewMany = event => {
        event.dialogs
            .filter(dialog => !dialog.isPinned && !dialog.folderId)
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
        if (dialog.peer instanceof GroupForbiddenPeer || dialog.peer instanceof ChannelForbiddenPeer || dialog.peer.raw.migrated_to) {
            return
        }

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