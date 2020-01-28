export const ForwardedHeaderFragment = ({message}) => {
    if (!message.raw.fwd_from) {
        return ""
    } else if (!message.forwarded) {
        return <div id={`message-${message.id}-fwd`} className="fwd">...</div>
    }

    if (typeof message.forwarded === "string") {
        return <div id={`message-${message.id}-fwd`} className="fwd">Forwarded from {message.forwarded}</div>
    } else {
        return <div id={`message-${message.id}-fwd`} className="fwd">Forwarded from {message.forwarded.name}</div>
    }
}