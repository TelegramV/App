import {ContextMenuManager} from "../../../../../../contextMenuManager";
import {ChatInputManager} from "../../chatInput/ChatInputComponent";
import {MessageAvatarComponent} from "./MessageAvatarComponent"
import {InlineKeyboardComponent} from "./InlineKeyboardComponent";
import {ReplyFragment} from "./ReplyFragment"
import {ForwardedHeaderFragment} from "./ForwardedHeaderFragment"

const ReplyToMessageFragment = ({message}) => {
    if (!message.raw.reply_to_msg_id) {
        return ""
    } else if (!message.replyToMessage) {
        return <ReplyFragment id={`message-${message.id}-rpl`} show={true}/>
    }

    return (
        <ReplyFragment id={`message-${message.id}-rpl`}
                       name={message.replyToMessage.from.name}
                       text={message.replyToMessage.text}
                       show={true}/>
    )
}

/**
 * @param {Message} message
 * @param transparent
 * @param slot
 * @param noPad
 * @param outerPad
 * @param contextActions
 * @param showUsername
 * @param showAvatar
 * @param avatarRef
 * @return {*}
 * @constructor
 */
const MessageWrapperFragment = ({message, transparent = false, slot, noPad = false, outerPad = true, contextActions, showUsername = true, showAvatar = true, avatarRef}) => {
    const defaultContextActions = [
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
            icon: "pin",
            title: "Pin"
        },
        {
            icon: "forward",
            title: "Forward"
        },
        {
            icon: "delete",
            title: "Delete",
            red: true
        },
    ];
    const contextMenuHandler = ContextMenuManager.listener(contextActions ? contextActions : defaultContextActions);

    const doubleClickHandler = _ => ChatInputManager.replyTo(message)

    const topLevelClasses = {
        "channel": message.isPost,
        "out": !message.isPost && message.isOut,
        "in": message.isPost || !message.isOut,
    }

    let wrapClasses = {
        "bubble": true,
        "out": !message.isPost && message.isOut,
        "in": message.isPost || !message.isOut,
        "transparent": transparent,
        "read": message.isRead,
        "no-pad": !outerPad,
        "sent": !message.isRead //TODO more convenient method to do this
    }

    let messageClasses = {
        "message": true,
        "no-pad": noPad
    }

    let wrapOuter = {
        "bubble-outer": true,
        "out": !message.isPost && message.isOut,
        "in": message.isPost || !message.isOut,
    }

    if (message.raw.fwd_from && (message.raw.fwd_from.saved_from_peer || message.raw.fwd_from.saved_from_msg_id)) {
        topLevelClasses["out"] = false
        topLevelClasses["in"] = true
        wrapClasses["out"] = false
        wrapClasses["in"] = true
        wrapOuter["out"] = false
        wrapOuter["in"] = true
    }

    const inlineKeyboard = message.replyMarkup && message.replyMarkup._ === "replyInlineMarkup" ?
        <InlineKeyboardComponent message={message}/> : ""
    // FIXME this should be called upon message receiving
    if (message.replyMarkup && (message.replyMarkup._ === "replyKeyboardHide" || message.replyMarkup._ === "replyKeyboardForceReply" || message.replyMarkup._ === "replyKeyboardMarkup")) {
        ChatInputManager.setKeyboardMarkup(message.replyMarkup)
    }

    const username = showUsername && message.from.name && !message.isPost && !message.isOut && !message.raw.reply_to_msg_id && !message.raw.fwd_from

    if (!message.isPost && topLevelClasses.in) {

        return (
            <div className={topLevelClasses}
                 id={`message-${message.id}`}
                 onContextMenu={contextMenuHandler}
                 onDblClick={doubleClickHandler}
                 data-peer={`${message.from.type}-${message.from.id}`}>



                <div className={wrapOuter}>
                    <MessageAvatarComponent id={`message-${message.id}-avatar`}
                                            show={showAvatar}
                                            ref={avatarRef}
                                            message={message}/>

                    <div className={wrapClasses}>

                        <ReplyToMessageFragment message={message}/>

                        <div className={messageClasses}>
                            <ForwardedHeaderFragment message={message}/>
                            {username ? <div className="username">{message.from.name}</div> : ""}
                            {slot}
                        </div>
                    </div>

                    {inlineKeyboard}
                </div>

            </div>
        )
    }

    return (
        <div className={topLevelClasses}
             id={`message-${message.id}`}
             onContextMenu={contextMenuHandler}
             onDblClick={doubleClickHandler}>

            <div className="bubble-outer">
                <div className={wrapClasses}>

                    <ReplyToMessageFragment message={message}/>

                    <div className={messageClasses}>
                        <ForwardedHeaderFragment message={message}/>
                        {username ? <div className="username">{message.from.name}</div> : ""}
                        {slot}
                    </div>
                </div>

                {inlineKeyboard}
            </div>
        </div>
    )
}

export default MessageWrapperFragment