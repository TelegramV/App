const MessageComponent = {
    name: "message",

    /**
     * @param {Message} message
     * @param slot
     * @return {*}
     */
    h({message, slot}) {
        const className = message.isPost ? "channel in" : message.isOut ? "out" : "in"
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

export default MessageComponent