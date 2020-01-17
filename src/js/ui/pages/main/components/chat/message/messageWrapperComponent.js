function MessageWrapperComponent({message, slot}) {
    const className = {
        "channel": message.isPost,
        "out": !message.isPost && message.isOut,
        "in": message.isPost || !message.isOut,
    }

    const from = message.from

    let hasAvatar = !from.photo.isEmpty

    const classes = "avatar" + (!hasAvatar ? ` placeholder-${from.photo.letter.num}` : "")
    const letter = hasAvatar ? "" : from.photo.letter.text

    const cssBackgroundImage = hasAvatar ? `url(${from.photo.smallUrl})` : "none"
    // const cssOpacity = hasAvatar ? 1 : 0

    // return (
    //     <div className={classes}
    //          css-background-image={cssBackgroundImage}>
    //         {letter}
    //     </div>
    // )

    return (
        <div class={className} data-id={message.id} data-peer={`${from.type}.${from.id}`}>
            {!message.isPost && className.in ? (
                <div className={classes}
                     css-background-image={cssBackgroundImage}>
                    {letter}
                </div>
            ) : ""}
            {slot}
        </div>
    )
}

export default MessageWrapperComponent