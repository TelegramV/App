/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"
import {DialogFragment} from "./Fragments/DialogFragment"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import DialogsManager from "../../../../../Api/Dialogs/DialogsManager"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import UIEvents from "../../../../EventBus/UIEvents"
import DialogsStore from "../../../../../Api/Store/DialogsStore"
import foldersState from "../../../foldersState"
import {UserPeer} from "../../../../../Api/Peers/Objects/UserPeer"
import {ChannelPeer} from "../../../../../Api/Peers/Objects/ChannelPeer"
import {GroupPeer} from "../../../../../Api/Peers/Objects/GroupPeer"
import {BotPeer} from "../../../../../Api/Peers/Objects/BotPeer"
import {SupergroupPeer} from "../../../../../Api/Peers/Objects/SupergroupPeer"
import {dialogContextMenu} from "./dialogContextMenu"
import FastVirtualList from "../../../../../V/VRDOM/list/FastVirtualList"

function folderFilter(filter) {
    return dialog => {
        const peer = dialog.peer;

        const include_peers = filter.include_peers || [];
        const exclude_peers = filter.exclude_peers || [];

        const excluded = exclude_peers.some(inputPeer =>
            (inputPeer._ === "inputPeerUser" && inputPeer instanceof UserPeer && inputPeer.id === inputPeer.user_id) ||
            (inputPeer._ === "inputPeerChannel" && inputPeer instanceof ChannelPeer && inputPeer.id === inputPeer.channel_id) ||
            (inputPeer._ === "inputPeerChat" && inputPeer instanceof GroupPeer && inputPeer.id === inputPeer.chat_id) ||
            (inputPeer._ === "inputPeerSelf" && inputPeer instanceof UserPeer && inputPeer.isSelf));

        if (excluded) {
            return false;
        }

        const included = include_peers.some(inputPeer =>
            (inputPeer._ === "inputPeerUser" && peer instanceof UserPeer && peer.id === inputPeer.user_id) ||
            (inputPeer._ === "inputPeerChannel" && peer instanceof ChannelPeer && peer.id === inputPeer.channel_id) ||
            (inputPeer._ === "inputPeerChat" && peer instanceof GroupPeer && peer.id === inputPeer.chat_id) ||
            (inputPeer._ === "inputPeerSelf" && peer instanceof UserPeer && peer.isSelf)
        );

        if (included) {
            return true;
        }

        const isUser = peer instanceof UserPeer && !(peer instanceof BotPeer);
        const isContact = isUser && peer.isContact;
        const isGroup = peer instanceof GroupPeer || peer instanceof SupergroupPeer;
        const isChannel = peer instanceof ChannelPeer && !isGroup;
        const isBot = peer instanceof BotPeer;
        const isMuted = dialog.isMuted;
        const isArchived = dialog.isArchived;
        // TODO needs checking
        const isRead = dialog.peer.messages.unreadCount === 0 && dialog.peer.messages.unreadMentionsCount === 0;

        if (!filter.contacts && isContact) {
            return false;
        }

        if (!filter.non_contacts && !isContact && isUser) {
            return false;
        }

        if (!filter.groups && isGroup) {
            return false;
        }

        if (!filter.broadcasts && isChannel) {
            return false;
        }

        if (!filter.bots && isBot) {
            return false;
        }

        if (filter.exclude_muted && isMuted) {
            return false;
        }

        if (filter.exclude_read && isRead) {
            return false;
        }

        if (filter.exclude_archived && isArchived) {
            return false;
        }

        return true;
    }
}

class Dialog extends StatefulComponent {
    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .filter(event => event.dialog === this.props.dialog)
            .updateOn("updateActions");

        E.bus(AppEvents.Peers)
            .filter(event => event.message && event.message === this.props.dialog.peer.messages.last)
            .updateOn("messages.edited");

        E.bus(AppEvents.Peers)
            .filter(event => event.peer === this.props.dialog.peer)
            .updateOn("messages.readOut")
            .updateOn("messages.readIn")
            .updateOn("updateUserStatus");

        E.bus(UIEvents.General)
            .filter(({peer, prev}) => this.props.dialog.peer === peer || this.props.dialog.peer === prev)
            .updateOn("chat.select");
    }

    render({dialog}, state, globalState) {
        // if (!this.dialog) {
        //     this.dialog = dialog;
        // }
        //
        // dialog = this.dialog;

        return (
            <DialogFragment dialog={dialog}
                            click={this.onClick}
                            contextMenu={dialogContextMenu(dialog)}/>
        );
    }

    componentDidMount() {
        console.log("MOUNTED")
    }

    onClick = () => {
        if (AppSelectedChat.check(this.props.dialog.peer)) {
            UIEvents.General.fire("chat.scrollBottom")
        } else {
            AppSelectedChat.select(this.props.dialog.peer)
        }
    }
}

class VirtualDialogsFolderList extends StatefulComponent {
    state = {
        dialogs: [],
    };

    globalState = {
        foldersState,
    };

    appEvents(E) {
        E.bus(AppEvents.General)
            .on("foldersUpdate", this.update);

        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.update);

        E.bus(AppEvents.Peers)
            .on("messages.new", this.update);
    }

    render(props, {dialogs}, globalState) {
        if (foldersState.currentId) {
            dialogs = dialogs.filter(folderFilter(foldersState.current));
        }

        return (
            <div style={{
                "height": "100%",
            }}>
                <FastVirtualList itemHeight={72 + 4}
                                 items={dialogs}
                                 template={dialog => <Dialog dialog={dialog}/>}
                                 scrollThrottle={250}
                                 renderAhread={5}
                                 onScroll={event => {
                                     const $element = event.target;

                                     if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop && !this.state.isLoading) {
                                         this.download();
                                     }
                                 }}
                                 id="dialogs"
                                 className="list"/>
            </div>
        );
    }

    componentDidMount() {
        DialogsManager.fetchNextPage({limit: 100});
    }

    download = () => {
        if (this.state.isLoading) {
            return;
        }

        this.state.isLoading = true;

        DialogsManager.fetchNextPage({}).finally(() => {
            this.state.isLoading = false;
        });
    }

    update = () => {
        let dialogs = DialogsStore.sortWithPinnedOnTop();

        this.setState({
            dialogs,
        });
    }
}

export default VirtualDialogsFolderList;