import {ChatInputManager} from "../../ChatInput/ChatInputComponent";
import {InlineKeyboardComponent} from "./InlineKeyboardComponent";
import {MessageAvatarComponent} from "./MessageAvatarComponent";
import {ReplyFragment} from "./ReplyFragment"
import {ForwardedHeaderFragment} from "./ForwardedHeaderFragment"
import {MessageParser} from "../../../../../../Api/Messages/MessageParser";
import {UserPeer} from "../../../../../../Api/Peers/Objects/UserPeer";
import UIEvents from "../../../../../EventBus/UIEvents";
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer"
import VUI from "../../../../../VUI"
import {ChannelPeer} from "../../../../../../Api/Peers/Objects/ChannelPeer"
import API from "../../../../../../Api/Telegram/API"

function ReplyToMessageFragment({message}) {
    if (!message.raw.reply_to_msg_id) {
        return null
    } else if (!message.replyToMessage) {
        return (
            <ReplyFragment show={true}/>
        )
    }

    return (
        <ReplyFragment name={message.replyToMessage.from.name}
                       text={MessageParser.getPrefixNoSender(message.replyToMessage)}
                       show={true}
                       onClick={() => {
                           UIEvents.General.fire("chat.showMessage", {message: message.replyToMessage})
                       }}
        />
    )
}

function createContextMenu(message) {
    return [
        {
            icon: "reply",
            title: "Reply",
            onClick: _ => ChatInputManager.replyTo(message)
        },
        {
            icon: "copy",
            title: "Copy"
        },
        {
            icon: _ => message.isPinned ? "unpin" : "pin",
            title: _ => message.isPinned ? "Unpin" : "Pin",
            onClick: _ => {
                API.messages.updatePinnedMessage(message)
            }
        },
        {
            icon: "forward",
            title: "Forward",
            onClick: () => {
                UIEvents.General.fire("message.forward", {message, from: message.dialog.peer})
            }
        },
        {
            icon: "delete",
            title: "Delete",
            red: true,
            onClick: () => {
                if (message.dialogPeer instanceof ChannelPeer) {
                    API.channels.deleteMessages(message.dialogPeer, [message.id]);
                } else {
                    API.messages.deleteMessages([message.id]);
                }
            }
        },
    ];
}

function MessageWrapperFragment(
    {
        message,
        transparent = false,
        outerPad = true,
        contextActions,
        showUsername = true,
    },
    slot
) {
    const contextMenuHandler = VUI.ContextMenu.listener(contextActions ? contextActions : createContextMenu(message));

    const doubleClickHandler = _ => ChatInputManager.replyTo(message)

    const topLevelClasses = {
        "message": true,
        "channel": message.isPost,
        "out": !message.isPost && message.isOut,
        "in": message.isPost || !message.isOut,
    }

    const inlineKeyboard = message.replyMarkup && message.replyMarkup._ === "replyInlineMarkup" ?
        <InlineKeyboardComponent message={message}/> : ""

    let contentClasses = {
        "message-content": true,
        "transparent": transparent,
        "read": !message.isSending && message.isRead,
        "sending": message.isSending,
        "no-pad": !outerPad,
        "sent": !message.isSending && !message.isRead, //TODO more convenient method to do this
        "has-inline-keyboard": !!inlineKeyboard
    }
    contentClasses["group-" + message.tailsGroup] = true;

    if (message.raw.fwd_from && (message.raw.fwd_from.saved_from_peer || message.raw.fwd_from.saved_from_msg_id)) {
        topLevelClasses["out"] = false
        topLevelClasses["in"] = true
    }

    const isPrivateMessages = message.to instanceof UserPeer
    const username = showUsername && message.from.name && !message.isPost &&
        !message.isOut && !message.raw.reply_to_msg_id && !message.raw.fwd_from && !isPrivateMessages &&
        (message.tailsGroup === "s" || message.tailsGroup === "se")

    return (
        <div className={topLevelClasses}
             id={`message-${message.id}`}
             onContextMenu={contextMenuHandler}
             onDblClick={doubleClickHandler}>

            <MessageAvatarComponent message={message} show={!message.hideAvatar}/>
            <div className={contentClasses}>
                <ReplyToMessageFragment message={message}/>
                <ForwardedHeaderFragment message={message}/>
                {username ? <div css-cursor="pointer" className="username"
                                 onClick={() => AppSelectedInfoPeer.select(message.from)}>{message.from.name}</div> : ""}
                {slot}
            </div>
            {inlineKeyboard}
        </div>
    )
}

export default MessageWrapperFragment