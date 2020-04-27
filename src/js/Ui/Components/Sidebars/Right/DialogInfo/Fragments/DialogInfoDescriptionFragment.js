export const DialogInfoDescriptionFragment = ({name, status, isOnline, isLoading}) => {
    return (
        <div className="description">
            <div className="name">{name}</div>
            <div className={["status", isOnline ? "" : "offline", isLoading ? "loading-text" : ""]}>{status}</div>
        </div>
    )
}