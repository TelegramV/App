export const DialogBadgeFragment = ({show = false, slot}) => {
    return (
        <div showIf={show} className="badge tgico">
            {slot}
        </div>
    )
}