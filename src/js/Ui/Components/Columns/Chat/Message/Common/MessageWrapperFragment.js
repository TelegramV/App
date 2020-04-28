import { ChatInputManager } from "../../ChatInput/ChatInputComponent";
import { InlineKeyboardComponent } from "./InlineKeyboardComponent";
import { MessageAvatarComponent } from "./MessageAvatarComponent";
import { ReplyFragment } from "./ReplyFragment"
import { ForwardedHeaderFragment } from "./ForwardedHeaderFragment"
import { MessageParser } from "../../../../../../Api/Messages/MessageParser";
import { UserPeer } from "../../../../../../Api/Peers/Objects/UserPeer";
import UIEvents from "../../../../../EventBus/UIEvents";
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer"
import MTProto from "../../../../../../MTProto/External";
import UpdatesManager from "../../../../../../Api/Updates/UpdatesManager";
import VUI from "../../../../../VUI"

const ReplyToMessageFragment = ({ message }) => {
    if (!message.raw.reply_to_msg_id) {
        return ""
    } else if (!message.replyToMessage) {
        return <ReplyFragment id={`message-${message.id}-rpl`} show={true} onClick={l => {
            UIEvents.General.fire("chat.showMessage", {message: message.replyToMessage})
        }}/>
    }

    return (
        <ReplyFragment id={`message-${message.id}-rpl`}
                       name={message.replyToMessage.from.name}
                       text={MessageParser.getPrefixNoSender(message.replyToMessage)}
                       show={true} onClick={l => {
            UIEvents.General.fire("chat.showMessage", {message: message.replyToMessage})
        }}/>
    )
}

const MessageWrapperFragment = ({
        message,
        transparent = false,
        noPad = false,
        outerPad = true,
        contextActions,
        showUsername = true,
        avatarRef,
        bubbleRef
    },
    slot
) => {
    const defaultContextActions = [{
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
                MTProto.invokeMethod("messages.updatePinnedMessage", {
                    peer: message.to.inputPeer,
                    id: message.isPinned ? -1 : message.id
                }).then(l => {
                    UpdatesManager.process(l)
                })
            }
        },
        {
            icon: "forward",
            title: "Forward",
            onClick: () => {
                UIEvents.General.fire("message.forward", {message})
            }
        },
        {
            icon: "delete",
            title: "Delete",
            red: true
        },
    ];
    const contextMenuHandler = VUI.ContextMenu.listener(contextActions ? contextActions : defaultContextActions);

    const doubleClickHandler = _ => ChatInputManager.replyTo(message)

    let topLevelClasses = {
        "message": true,
        "channel": message.isPost,
        "out": !message.isPost && message.isOut,
        "in": message.isPost || !message.isOut,
    }

    const inlineKeyboard = message.replyMarkup && message.replyMarkup._ === "replyInlineMarkup" ?
        <InlineKeyboardComponent message={message}/> : ""

    let contentClasses = {
        "message-content": true,
        "no-pad": noPad,
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

    // FIXME this should be called upon message receiving
    if (message.replyMarkup && (message.replyMarkup._ === "replyKeyboardHide" || message.replyMarkup._ === "replyKeyboardForceReply" || message.replyMarkup._ === "replyKeyboardMarkup")) {
        ChatInputManager.setKeyboardMarkup(message.replyMarkup)
    }

    const isPrivateMessages = message.to instanceof UserPeer
    const username = showUsername && message.from.name && !message.isPost &&
        !message.isOut && !message.raw.reply_to_msg_id && !message.raw.fwd_from && !isPrivateMessages &&
        (message.tailsGroup === "s" || message.tailsGroup === "se")

    return (
        <div className={topLevelClasses}
             id={`cmsg${message.id}`}
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