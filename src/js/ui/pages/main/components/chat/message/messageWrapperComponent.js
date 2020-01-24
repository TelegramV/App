import {ContextMenuManager} from "../../../../../contextMenuManager";
import {ChatInputManager} from "../chatInput/ChatInputComponent";

const MessageWrapperComponent = ({message, transparent = false, slot, noPad = false}) => {
    const contextMenuHandler = ContextMenuManager.listener([
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
    ])

    const doubleClickHandler = _ => ChatInputManager.replyTo(message)

    const topLevelClasses = {
        "channel": message.isPost,
        "out": !message.isPost && message.isOut,
        "in": message.isPost || !message.isOut,
    }

    let wrapClasses = {
        "bubble": true,
        "transparent": transparent,
        "read": message.isRead,
        "sent": !message.isRead //TODO more convenient method to do this
    }

    let messageClasses = {
        "message": true,
        "no-pad": noPad
    }


    if (!message.isPost && topLevelClasses.in) {

        const hasAvatar = !message.from.photo.isEmpty

        const avatarClasses = ["avatar"]

        if (!hasAvatar) {
            avatarClasses.push(`placeholder-${message.from.photo.letter.num}`)
        }

        const cssBackgroundImage = hasAvatar ? `url(${message.from.photo.smallUrl})` : "none"

        return (
            <div className={topLevelClasses}
                 id={`message-${message.id}`}
                 onContextMenu={contextMenuHandler}
                 onDoubleClick={doubleClickHandler}>

                <div className={avatarClasses}
                     css-background-image={cssBackgroundImage}>
                    {hasAvatar ? message.from.photo.letter.text : ""}
                </div>

                <div className={wrapClasses}>
                    <div className={messageClasses}>
                        {slot}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={topLevelClasses}
             id={`message-${message.id}`}
             onContextMenu={contextMenuHandler}
             onDoubleClick={doubleClickHandler}>

            <div className={wrapClasses}>
                <div className={messageClasses}>
                    {slot}
                </div>
            </div>
        </div>
    )
}
export default MessageWrapperComponent