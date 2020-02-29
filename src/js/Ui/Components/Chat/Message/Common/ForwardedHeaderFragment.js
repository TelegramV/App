import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";

const openUser = forwarded => {
    AppSelectedInfoPeer.select(forwarded)
}
export const ForwardedHeaderFragment = ({message}) => {
    if (!message.raw.fwd_from) {
        return ""
    } else if (!message.forwarded) {
        return <div id={`message-${message.id}-fwd`} className="fwd">...</div>
    }

    if (typeof message.forwarded === "string") {
        return <div id={`message-${message.id}-fwd`} className="fwd">Forwarded from <span
            className="no-bold">{message.forwarded}</span></div>
    } else {
        return <div id={`message-${message.id}-fwd`} className="fwd">Forwarded from <span className="clickable-name"
                                                                                          onClick={l => openUser(message.forwarded)}>{message.forwarded.name}</span>
        </div>
    }
}