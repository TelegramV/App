import {ContextMenuManager} from "../../../../../contextMenuManager";
import {ChatInputManager} from "../chatInput/ChatInputComponent";

const MessageWrapperComponent = ({message, transparent = false, slot}) => {
    const className = {
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

    const from = message.from

    let hasAvatar = !from.photo.isEmpty

    const classes = "avatar" + (!hasAvatar ? ` placeholder-${from.photo.letter.num}` : "")
    const letter = hasAvatar ? "" : from.photo.letter.text

    const cssBackgroundImage = hasAvatar ? `url(${from.photo.smallUrl})` : "none"

    return (
        <div className={className} id={`message-${message.id}`}
             onContextMenu={ContextMenuManager.listener([
                 {
                     icon: "reply",
                     title: "Reply",
                     onClick: l => ChatInputManager.replyTo(message)
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
             ])} onDoubleClick={l => ChatInputManager.replyTo(message)}>
            {!message.isPost && className.in ? (
                <div className={classes}
                     css-background-image={cssBackgroundImage}>
                    {letter}
                </div>
            ) : ""}
            <div className={wrapClasses}>
                {slot}
            </div>
        </div>
    )
}
export default MessageWrapperComponent