import {parseMessageEntities} from "../../../../../mtproto/utils/htmlHelpers"
import MessageComponent from "./messageComponent"

function vGetClass(data, transparent = false) {
    let classes = "bubble"
    if (data.isRead) classes += " read"
    if (transparent) classes += " transparent"
    return classes
}

function vForwardedTemplate(data) {
    return data.fwd ? <div class="fwd">Forwarded from {data.fwd.from}</div> : "";
}

function vTimeTemplate(message, bg = false) {
    let classes = "time" + (bg ? " bg" : "")

    return (
        <span class={classes}>
            <div class="inner tgico">{message.views ?
                <span>{message.views} <span
                    class="tgico tgico-channelviews"/>    </span> : ""}{message.getDate('en', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })}</div>
        </span>
    )
}

const TextMessageComponent = {
    name: "text-only-message",
    h({message}) {
        const username = message.userName && !message.post && !message.out;
        let msg = parseMessageEntities(message.text ? message.text : "", message.entities)
        // msg = msg ? emoji.replace_unified(msg) : "";

        return <MessageComponent message={message}>
            <div className={vGetClass(message)}>
                {username ? <div className="username">{username}</div> : ""}

                {message.reply ? (<div className="box rp">
                    <div className="quote">
                        <div className="name">{message.reply.name}</div>
                        <div className="text">{message.reply.text}</div>
                    </div>
                </div>) : ""}
                <div className={`message ${username ? "nopad" : ""}`}>

                    {vForwardedTemplate(message)}
                    <span dangerouslySetInnerHTML={msg}/>
                    {vTimeTemplate(message)}
                </div>
            </div>
        </MessageComponent>
    }
}

export default TextMessageComponent