// If there's no message it it should display "Photo" or smth
export function getMediaPreviewName(message) {
    switch (message.media._) {
        case "messageMediaPhoto":
            console.log("PHOTO")
            return "Photo"
        case "messageMediaGeo":
            return "Location"
        case "messageMediaGeoLive":
            return "Live Location"
        case "messageMediaGame":
            return "🎮 " + message.media.game.title
        case "messageMediaPoll":
            return message.media.poll.question
        case "messageMediaInvoice":
            return "Invoice"
        case "messageMediaWebPage":
            return ""
        case "messageMediaContact":
            return "Contact"
        case "messageMediaDocument":
            return "Document" // TODO other documents
        case "messageMediaUnsupported":
        default:
            console.log("unsupported", message.media)
            return "Unsupported"

    }
}

export function getMessagePreviewDialog(message, showSender) {
    if(message._ === "messageService")
    {
        return "Service message" // TODO parse service messages
    }
    let text = ""
    if(message.media) {
        const p = getMediaPreviewName(message)
        if(p.length > 0)
            text = (showSender ? ": " : "") + p + (message.message.length > 0 ? ", " : "")
    } else if(message.message.length > 0 && showSender) {
        text += ": "
    }
    return text
}

export function formatTimeAudio(seconds) {
    const dt = new Date(0)
    dt.setSeconds(seconds)
    return dt.toLocaleTimeString("en", {
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
}