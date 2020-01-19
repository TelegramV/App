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
        <div class={className} data-id={message.id} data-peer={`${from.type}.${from.id}`}>
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