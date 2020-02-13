import VComponent from "../../../../../../v/vrdom/component/VComponent"
import AppEvents from "../../../../../../../api/eventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import VF from "../../../../../../v/VFramework"
import {VUI} from "../../../../../../v/VUI"
import {GroupForbiddenPeer} from "../../../../../../../api/peers/objects/GroupForbiddenPeer"
import {ChannelForbiddenPeer} from "../../../../../../../api/peers/objects/ChannelForbiddenPeer"

export default class GeneralDialogListComponent extends VComponent {

    identifier = `dialogs-general-list`

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)
            .on("gotNewMany", this.onDialogsGotNewMany)
    }

    h() {
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