import {ContextMenuManager} from "../../../../../contextMenuManager";

const onContextMenu = ev => {
    ev.preventDefault()
    ContextMenuManager.openXY([
        {
            icon: "reply",
            title: "Reply"
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
    ], ev.clientX, ev.clientY)
}
const MessageWrapperComponent = ({ message, transparent = false, slot }) => {
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
        <div className={className} data-id={message.id} data-peer={`${from.type}.${from.id}`} onContextMenu={onContextMenu}>
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