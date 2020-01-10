const Message = {
    name: "message",
    h({message, slot}) {
        const className = message.post ? "channel in" : message.out ? "out" : "in"
        const from = message.from

        let hasAvatar = from.hasAvatar && from._avatar !== undefined

        const classes = "avatar" + (!hasAvatar ? ` placeholder-${from.avatarLetter.num}` : "")
        const letter = hasAvatar ? "" : from.avatarLetter.text

        const cssBackgroundImage = hasAvatar ? `url(${from._avatar})` : "none"
        // const cssOpacity = hasAvatar ? 1 : 0

        // return (
        //     <div className={classes}
        //          css-background-image={cssBackgroundImage}>
        //         {letter}
        //     </div>
        // )

        return (
            <div class={className} data-id={message.id} data-peer={`${from.type}.${from.id}`}>
                {className === "in" ? (
                    <div className={classes}
                         css-background-image={cssBackgroundImage}>
                        {letter}
                    </div>
                ) : ""}
                {slot}
            </div>
        )
    }
}

export default Message