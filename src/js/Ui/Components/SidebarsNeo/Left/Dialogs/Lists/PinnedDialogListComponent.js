import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import VApp from "../../../../../../V/vapp"
import {UserPeer} from "../../../../../../Api/Peers/Objects/UserPeer";
import {ChannelPeer} from "../../../../../../Api/Peers/Objects/ChannelPeer";
import {GroupPeer} from "../../../../../../Api/Peers/Objects/GroupPeer";
import {vrdom_resolveMount} from "../../../../../../V/VRDOM/mount";
import DialogsStore from "../../../../../../Api/Store/DialogsStore";
import StatelessComponent from "../../../../../../V/VRDOM/component/StatelessComponent"
import classIf from "../../../../../../V/VRDOM/jsx/helpers/classIf";

export default class PinnedDialogListComponent extends StatelessComponent {

    // TODO needs rework!!
    identifier = `dialogs-pinned-list-${this.props.folderId}`

    init() {
        super.init()
        this.filter = this.props.filter
        this.folderId = this.props.folderId
    }

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)
            .on("gotArchived", this.onDialogsGotMany)
            .on("gotNewMany", this.onDialogsGotNewMany)
            .on("gotOne", this.onDialogsGotOne)

    }

    render() {
        return (
            <div id="dialogsPinned" className={["list pinned hidden", classIf(this.folderId === "archive", "archive")]}/>
        )
    }

    applyFilter = (dialog) => {
        const f = this.filter
        const id = this.folderId
        if(id === "archive") {
            return dialog.isPinned && dialog.isArchived
        }
        if (f == null || id == null) {
            return dialog.isPinned && !dialog.isArchived
        }
        const pinned = f.pinned_peers
        const peer = dialog.peer
        // console.log("applying filter", dialog.peer.name, pinned, peer.id, pinned.some(l => {
        //     if(l._ === "inputPeerUser" && peer instanceof UserPeer && peer.id === l.user_id) return true
        //     if(l._ === "inputPeerChannel" && peer instanceof ChannelPeer && peer.id === l.channel_id) return true
        //     if(l._ === "inputPeerChat" && peer instanceof GroupPeer && peer.id === l.chat_id) return true
        //     if(l._ === "inputPeerSelf" && peer instanceof UserPeer && peer.isSelf) return true
        //     return false
        // }))
        return pinned.some(l => {
            if (l._ === "inputPeerUser" && peer instanceof UserPeer && peer.id === l.user_id) return true
            if (l._ === "inputPeerChannel" && peer instanceof ChannelPeer && peer.id === l.channel_id) return true
            if (l._ === "inputPeerChat" && peer instanceof GroupPeer && peer.id === l.chat_id) return true
            if (l._ === "inputPeerSelf" && peer instanceof UserPeer && peer.isSelf) return true
            return false
        })
    }

    updateFilter = (newFilter) => {
        if(this.folderId === "archive") return
        this.filter = newFilter
        const $dialogs = this.$el

        const renderedDialogs = $dialogs.childNodes
        // console.log(newFilter.title, renderedDialogs, renderedDialogs.length)

        // Remove all redundant
        let i = 0
        let toDestroy = []
        renderedDialogs.forEach($rendered => {
            const dialog = $rendered.__dialog

            if (dialog && this.applyFilter(dialog)) {

            } else {
                toDestroy.push($rendered.__v.component)
            }
            i++
        })

        toDestroy.forEach(component => {
            component.__destroy()
        })
        // Add new
        DialogsStore.toArray()
            .filter(this.applyFilter)
            .forEach(this.addNewDialog)
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
        if (!this.applyFilter(dialog)) return
        this.addNewDialog(dialog)

    }

    addNewDialog = dialog => {
        const $insertBefore = this._findRenderedDialogToInsertBefore(dialog)
        this.insertBeforeDialog(dialog, $insertBefore)
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
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-${this.folderId}-pin`)) {
            // console.error("BUG: dialog already rendered")
        } else {
            VRDOM.prepend(<DialogComponent dialog={dialog} folderId={this.folderId} isPin list={this}/>, this.$el)
        }
    }

    appendDialog = dialog => {
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-${this.folderId}-pin`)) {
            // console.error("BUG: dialog already rendered")
        } else {
            VRDOM.append(<DialogComponent dialog={dialog} folderId={this.folderId} isPin list={this}/>, this.$el)
        }
    }

    insertBeforeDialog = (dialog, $el) => {
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-${this.folderId}-pin`)) {
            // Normal behaviour, not an error
            // console.error("BUG: dialog already rendered", dialog.peer.name, this.folder)
        } else {
            const c = VRDOM.render(<DialogComponent dialog={dialog} folderId={this.folderId} isPin list={this}/>)
            this.$el.insertBefore(c, $el)
            vrdom_resolveMount(c)
        }
    }

    resort = _ => {
        // ...
    }
}