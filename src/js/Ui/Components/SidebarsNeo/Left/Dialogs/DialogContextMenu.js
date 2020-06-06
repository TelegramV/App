/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {ChannelPeer} from "../../../../../Api/Peers/Objects/ChannelPeer"
import {GroupPeer} from "../../../../../Api/Peers/Objects/GroupPeer"
import {SupergroupPeer} from "../../../../../Api/Peers/Objects/SupergroupPeer"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer"
import {Dialog} from "../../../../../Api/Dialogs/Dialog"
import VUI from "../../../../VUI"
import FoldersManager from "../../../../../Api/Dialogs/FolderManager";

export const DialogContextMenu = (dialog: Dialog, folderId) => {
    return VUI.ContextMenu.listener([
        () => {
            return {
                icon: dialog.folderId === 1 ? "unarchive" : "archive",
                title: dialog.folderId === 1 ? "Unarchive chat" : "Archive chat",
                onClick: _ => {
                    if (dialog.folderId === 1) {
                        dialog.api.setArchived(false)
                    } else {
                        dialog.api.setArchived(true)
                    }
                }
            }
        },
        () => {
            const isPinned =  folderId === null ? dialog.isPinned : FoldersManager.isPinned(dialog.peer, folderId)
            return {
                icon: isPinned ? "unpin" : "pin",
                title: isPinned ? "Unpin from top" : "Pin to top",
                onClick: _ => {
                    if(folderId == null) {
                        if (dialog.isPinned) {
                            dialog.api.setPinned(false)
                        } else {
                            dialog.api.setPinned(true)
                        }
                    } else {
                        if (FoldersManager.isPinned(dialog.peer, folderId)) {
                            FoldersManager.setPinned(false, dialog.peer, folderId)
                        } else {
                            FoldersManager.setPinned(true, dialog.peer, folderId)
                        }
                    }
                }
            }
        },
        {
            icon: "info",
            title: dialog.peer instanceof ChannelPeer ? "View channel info" : (dialog.peer instanceof GroupPeer || dialog.peer instanceof SupergroupPeer ? "View group info" : "View profile"),
            onClick: _ => {
                AppSelectedInfoPeer.select(dialog.peer)
            }
        },
        {
            icon: dialog.isMuted ? "unmute" : "mute",
            title: dialog.isMuted ? "Enable notifications" : "Disable notifications"
        },
        () => {
            return {
                icon: dialog.unreadMark ? "message" : "unread",
                title: dialog.unreadMark ? "Mark as read" : "Mark as unread",
                onClick: _ => {
                    if (dialog.unreadMark) {
                        dialog.api.markDialogUnread(false)
                    } else {
                        dialog.api.markDialogUnread(true)
                    }
                }
            }
        },
        {
            icon: "delete",
            title: "Delete chat",
            red: true,
            onClick: _ => {
                // VUI.Modal.open(<div className="delete-chat-title">
                //         <DialogAvatarFragment peer={dialog.peer}/>
                //         Delete Chat?
                //     </div>,
                //     <div className="delete-chat-body">
                //                      <span
                //                          className="text">Are you sure you want to delete chat with <b>{dialog.peer.name}</b>?</span>
                //         <FlatButtonComponent red label={`Delete for me and ${dialog.peer.name}`}/>
                //         <FlatButtonComponent red label="Delete just for me"/>
                //         <FlatButtonComponent label="Cancel"/>
                //     </div>)
            }
        },
    ])
}