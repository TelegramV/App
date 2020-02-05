export const DialogInfoDescriptionFragment = ({name, status, isOnline}) => {
    return (
        <div className="description">
            <div className="name">{name}</div>
            <div className={["status", isOnline ? "" : "offline"]}>{status}</div>
        </div>
    )
}