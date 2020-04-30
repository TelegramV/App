import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import {DialogComponent} from "../DialogComponent"
import {GroupForbiddenPeer} from "../../../../../../Api/Peers/Objects/GroupForbiddenPeer"
import {ChannelForbiddenPeer} from "../../../../../../Api/Peers/Objects/ChannelForbiddenPeer"
import VApp from "../../../../../../V/vapp"
import {UserPeer} from "../../../../../../Api/Peers/Objects/UserPeer";
import {BotPeer} from "../../../../../../Api/Peers/Objects/BotPeer";
import {GroupPeer} from "../../../../../../Api/Peers/Objects/GroupPeer";
import {SupergroupPeer} from "../../../../../../Api/Peers/Objects/SupergroupPeer";
import {ChannelPeer} from "../../../../../../Api/Peers/Objects/ChannelPeer";
import lottie from "../../../../../../../../vendor/lottie-web";
import MTProto from "../../../../../../MTProto/External";
import DialogsManager from "../../../../../../Api/Dialogs/DialogsManager";
import DialogsStore from "../../../../../../Api/Store/DialogsStore";
import {vrdom_resolveMount} from "../../../../../../V/VRDOM/mount";

export default class GeneralDialogListComponent extends VComponent {

    // TODO needs rework!!
    // identifier = `dialogs-general-list`

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.onDialogsGotMany)
            .on("gotNewMany", this.onDialogsGotNewMany)
            .on("gotOne", this.onDialogsGotOne)
    }

    render() {
        return (
            <div id="dialogs" className="list hidden"/>
        )
    }

    applyFilter = (dialog) => {
        const f = this.props.filter
        const id = this.props.folderId
        if(f == null || id == null) {
            return !dialog.isPinned && !dialog.folderId
        }
        const include = f.include_peers
        const exclude = f.exclude_peers
        const peer = dialog.peer
        const isUser = peer instanceof UserPeer && !(peer instanceof BotPeer)
        const isContact = isUser && peer.isContact
        const isGroup = peer instanceof GroupPeer || peer instanceof SupergroupPeer
        const isChannel = peer instanceof ChannelPeer && !isGroup
        const isBot = peer instanceof BotPeer
        const isMuted = dialog.isMuted
        // TODO needs checking
        const isRead = dialog.peer.messages.unreadCount === 0 || !dialog.unreadMark

        const isArchived = dialog.isArchived

        if(include && include.some(l => {
            if(l._ === "inputPeerUser" && peer instanceof UserPeer && peer.id === l.user_id) return true
            if(l._ === "inputPeerChannel" && peer instanceof ChannelPeer && peer.id === l.channel_id) return true
            if(l._ === "inputPeerChat" && peer instanceof GroupPeer && peer.id === l.chat_id) return true
            if(l._ === "inputPeerSelf" && peer instanceof UserPeer && peer.isSelf) return true
            return false
        })) {
            return true
        }

        if(exclude && include.some(l => {
            if(l._ === "inputPeerUser" && peer instanceof UserPeer && peer.id === l.user_id) return true
            if(l._ === "inputPeerChannel" && peer instanceof ChannelPeer && peer.id === l.channel_id) return true
            if(l._ === "inputPeerChat" && peer instanceof GroupPeer && peer.id === l.chat_id) return true
            if(l._ === "inputPeerSelf" && peer instanceof UserPeer && peer.isSelf) return true
            return false
        })) {
            return false
        }

        if(!f.contacts && isContact) {
            return false
        }

        if(!f.non_contacts && !isContact && isUser) {
            return false
        }

        if(!f.groups && isGroup) {
            return false
        }

        if(!f.broadcasts && isChannel) {
            return false
        }

        if(!f.bots && isBot) {
            return false
        }

        if(f.exclude_muted && isMuted) {
            return false
        }

        if(f.exclude_read && isRead) {
            return false
        }

        if(f.exclude_archived && isArchived) {
            return false
        }

        return true
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
        if(!this.applyFilter(dialog)) return
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
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-${this.props.folderId}`)) {
            // console.error("BUG: dialog already rendered", dialog.peer.name, this.props.folderId)
        } else {
            VRDOM.prepend(<DialogComponent dialog={dialog} folderId={this.props.folderId} list={this}/>, this.$el)
        }
    }

    appendDialog = dialog => {
        if (dialog.peer instanceof GroupForbiddenPeer || dialog.peer instanceof ChannelForbiddenPeer || dialog.peer.raw.migrated_to) {
            return
        }

        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-${this.props.folderId}`)) {
            // console.error("BUG: dialog already rendered", dialog.peer.name, this.props.folderId)
        } else {
            VRDOM.append(<DialogComponent dialog={dialog} folderId={this.props.folderId} list={this}/>, this.$el)
        }
    }

    insertBeforeDialog = (dialog, $el) => {
        if (VApp.mountedComponents.has(`dialog-${dialog.peer.type}-${dialog.peer.id}-${this.props.folderId}`)) {
            // Normal behaviour, not an error
            // console.error("BUG: dialog already rendered", dialog.peer.name, this.props.folder)
        } else {
            const c = VRDOM.render(<DialogComponent dialog={dialog} folderId={this.props.folderId} list={this}/>)
            this.$el.insertBefore(c, $el)
            vrdom_resolveMount(c)
        }
    }

    resort = _ => {
        // ...
    }
}