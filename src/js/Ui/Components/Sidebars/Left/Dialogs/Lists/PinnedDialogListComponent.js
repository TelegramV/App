import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import VApp from "../../../../../../V/vapp"
import {UserPeer} from "../../../../../../Api/Peers/Objects/UserPeer";
import {ChannelPeer} from "../../../../../../Api/Peers/Objects/ChannelPeer";
import {GroupPeer} from "../../../../../../Api/Peers/Objects/GroupPeer";

export default class PinnedDialogListComponent extends VComponent {

    // TODO needs rework!!
    // identifier = `dialogs-pinned-list`

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

    applyFilter = (dialog) => {
        const f = this.props.filter
        const id = this.props.folderId
        if (f == null || id == null) {
            return dialog.isPinned
        }
        const pinned = f.pinned_peers
        const peer = dialog.peer
        return pinned.some(l => {
            if(l._ === "inputPeerUser" && peer instanceof UserPeer && peer.id === l.user_id) return true
            if(l._ === "inputPeerChannel" && peer instanceof ChannelPeer && peer.id === l.channel_id) return true
            if(l._ === "inputPeerChat" && peer instanceof GroupPeer && peer.id === l.chat_id) return true
            if(l._ === "inputPeerSelf" && peer instanceof UserPeer && peer.isSelf) return true
            return false
        })
    }

    onDialogsGotMany = event => {
        $(this.$el).show()

        event.dialogs
            .filter(this.applyFilter)
            .forEach(this.appendDialog)
    }

    onDialogsGotNewMany = event => {
        event.dialogs
            .filter(this.applyFilter)
            .forEach(this.prependDialog)
    }

    prependDialog = dialog => {
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-${this.props.folderId}`)) {
            console.error("BUG: dialog already rendered")
        } else {
            VRDOM.prepend(<DialogComponent dialog={dialog} folderId={this.props.folderId} list={this}/>, this.$el)
        }
    }

    appendDialog = dialog => {
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-${this.props.folderId}`)) {
            console.error("BUG: dialog already rendered")
        } else {
            VRDOM.append(<DialogComponent dialog={dialog} folderId={this.props.folderId} list={this}/>, this.$el)
        }
    }

    resort = _ => {
        // ...
    }
}