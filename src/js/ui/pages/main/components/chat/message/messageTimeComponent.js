function MessageTimeComponent({message, bg = false}) {
    let classes = "time" + (bg ? " bg" : "")

    if (message.rawMessage.views) {
        return (
            <span class={classes}>
                    <div class="inner tgico">
                        <span>{message.rawMessage.views}
                            <span class="tgico tgico-channelviews"/>
                        </span>
                        {message.getDate('en', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })}
                    </div>
                </span>
        )
    }

    return (
        <span class={classes}>
                <div class="inner tgico">
                    {message.getDate('en', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                </div>
            </span>
    )
}

export default MessageTimeComponent