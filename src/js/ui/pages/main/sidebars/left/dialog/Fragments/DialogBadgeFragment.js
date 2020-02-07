export const DialogBadgeFragment = ({id, show = false, slot}) => {
    if (!show) {
        return (
            <div id={id} css-display="none" className="badge tgico"/>
        )
    }

    return (
        <div id={id} css-display="" className="badge tgico">
            {slot}
        </div>
    )
}