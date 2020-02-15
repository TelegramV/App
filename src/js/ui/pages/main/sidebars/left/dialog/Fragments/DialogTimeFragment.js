import MTProto from "../../../../../../../mtproto/external"

export const DATE_FORMAT_TIME = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}

export const DATE_FORMAT = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
}

export const DialogTimeFragment = ({id, dialog}) => {
    return (
        <div id={id} className="time">
            {dialog.peer.messages.last.getDate("en", MTProto.TimeManager.now(true) - dialog.peer.messages.last.date > 86400 ? DATE_FORMAT : DATE_FORMAT_TIME)}
        </div>
    )
}