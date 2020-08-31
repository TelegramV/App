import {UserPeer} from "../../../../../../Api/Peers/Objects/UserPeer";
import AppSelectedChat from "../../../../../Reactive/SelectedChat";
import AvatarComponent from "../../../../Basic/AvatarComponent";
import Locale from "../../../../../../Api/Localization/Locale";
import foldersState from "../../../../foldersState";
import FoldersManager from "../../../../../../Api/Dialogs/FolderManager";

function Text({dialog}) {
    if (dialog.draft.isPresent) {
        return (
            <div className="message">
                <span className="draft">Draft: </span>
                {dialog.draft.message}
            </div>
        );
    } else if (dialog.actions.size > 0) {
        const action = dialog.action;

        if (action) {
            return (
                <div className="message loading-text">
                    {Locale.lp(action)}
                </div>
            );
        }
    }

    return (
        <div className="message">
            <span className="sender">{dialog.peer.messages.last.prefix}</span>
            {dialog.peer.messages.last.text.substring(0, 100)}
        </div>
    );
}

export const DialogFragment = (
    {
        dialog,
        contextMenu,
        click,
    }
) => {
    const peer = dialog.peer;
    let lastMessage = dialog.peer.messages.last;

    const personClasses = {
        "person": true,
        "rp": true,
        "online": peer instanceof UserPeer && peer.online,
        "active": AppSelectedChat.check(dialog.peer),
        "unread": dialog.peer.messages.unreadMentionsCount > 0 || dialog.peer.messages.unreadCount > 0 || dialog.unreadMark,
        "muted": dialog.isMuted,
    };

    if (lastMessage && lastMessage.isOut && !dialog.peer.isSelf) {
        personClasses["sent"] = true;

        if (lastMessage.isRead) {
            personClasses["read"] = true;
        }
    }

    const pinned = foldersState.current == null ? dialog.pinned : FoldersManager.isPinned(peer, foldersState.current.id);
    const showPin = pinned && dialog.peer.messages.unreadMentionsCount === 0 && dialog.peer.messages.unreadCount === 0 && !dialog.unreadMark;

    return (
        <div data-message-id={lastMessage.id}
             className={personClasses}
             onClick={click}
             onContextMenu={contextMenu}>

            <AvatarComponent peer={dialog.peer}/>

            <div className="content">

                <div className="top">
                    <div className="title">
                        {peer.isSelf ? Locale.l("lng_saved_messages") : peer.name}
                    </div>

                    <div className="status tgico"/>

                    <div className="time">
                        {dialog.peer.messages.last.getFormattedDateOrTime()}
                    </div>
                </div>

                <div className="bottom">
                    {Text({dialog})}

                    {dialog.peer.messages.unreadMentionsCount > 0
                        ? <div className="badge tgico">
                            @
                        </div>
                        : ""}

                    {dialog.peer.messages.unreadCount > 0
                        ? <div className="badge tgico">
                            {dialog.peer.messages.unreadCount}
                        </div>
                        : ""}

                    {dialog.unreadMark
                        ? <div className="badge tgico">
                            {" "}
                        </div>
                        : ""}

                    {showPin && <div className="badge tgico pin"/>}
                </div>
            </div>
        </div>
    );
};