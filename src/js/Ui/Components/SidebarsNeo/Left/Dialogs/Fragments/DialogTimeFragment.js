export const DialogTimeFragment = ({id, dialog}) => {
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    return (
        <div id={id} className="time">
            {dialog.peer.messages.last.getFormattedDate()}
        </div>
    )
}