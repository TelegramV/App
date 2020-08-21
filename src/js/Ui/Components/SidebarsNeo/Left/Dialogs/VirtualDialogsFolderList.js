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
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";
import VComponent from "../../../../../V/VRDOM/component/VComponent";

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
        const isRead = dialog.peer.messages.unreadCount <= 0 && dialog.peer.messages.unreadMentionsCount <= 0;

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
            .updateOn("updateActions")
            .updateOn("updatePinned")

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
                            contextMenu={dialogContextMenu(dialog, foldersState.current?.id)}/>
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
    fastVirtualListRef = VComponent.createComponentRef()

    state = {
        dialogs: [],
    };

    // globalState = {
    //     foldersState,
    // };

    appEvents(E) {
        E.bus(AppEvents.General)
            .on("foldersUpdate", this.update)
            .on("selectFolder", this.update)

        E.bus(AppEvents.Dialogs)
            .on("gotMany", this.update)
            .on("gotArchived", this.update)
            .on("updatePinned", this.update)

        E.bus(AppEvents.Telegram)
            .on("updateFolderPeers", this.update)

        E.bus(AppEvents.Peers)
            .on("messages.new", this.update)
            // .on("messages.deleted", this.update)
            .on("messages.readIn", this.update)
    }

    render(props, {dialogs}, globalState) {
        if (!props.archived && foldersState.current) {
            dialogs = dialogs.filter(folderFilter(foldersState.current));
        }
        if(!props.archived && foldersState.current == null) {
            dialogs = dialogs.filter(dialog => !dialog.isArchived);
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
                                 ref={this.fastVirtualListRef}
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

    sortWithPinnedOnTop = (folderId = null): Dialog[] => {
        if(this.props?.archived) {
            return DialogsStore.getAllInFolder(1).sort(this.sortWithPinnedOnTopCompareFnGenerator(null));
        } else {
            return DialogsStore.toArray().sort(this.sortWithPinnedOnTopCompareFnGenerator(folderId));
        }
    }

    sortWithPinnedOnTopCompareFnGenerator = (folderId = null) => {
        return (a, b) => {
            let aPinned = folderId == null ? a.isPinned : FoldersManager.isPinned(a.peer, folderId)
            let bPinned = folderId == null ? b.isPinned : FoldersManager.isPinned(b.peer, folderId)
            if (!bPinned && !aPinned) {
                if (!a.messages.last) {
                    return 1
                }

                if (!b.messages.last) {
                    return -1
                }

                if (a.messages.last.date > b.messages.last.date) {
                    return -1
                }

                if (a.messages.last.date < b.messages.last.date) {
                    return 1
                }
            } else {
                if (aPinned) {
                    return -1
                }

                if (bPinned) {
                    return 1
                }
            }

            return 0
        };
    }

    componentDidMount() {
        DialogsManager.fetchNextPage({limit: 100});
    }

    download = () => {
        if (this.state.isLoading) {
            return;
        }

        this.state.isLoading = true;

        DialogsManager.fetchNextPage({}).catch(_ => {

        }).finally(() => {
            this.state.isLoading = false;
        })
    }

    update = () => {
        let dialogs = this.sortWithPinnedOnTop(foldersState.current?.id);

        this.setState({
            dialogs,
        });
    }
}

export default VirtualDialogsFolderList;