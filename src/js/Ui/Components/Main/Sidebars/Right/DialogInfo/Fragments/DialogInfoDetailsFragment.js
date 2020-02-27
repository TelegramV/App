export const DialogInfoDetailsFragment = ({icon, text = "", label, hidden = false, id}) => {
    return (
        <div className={["details", hidden ? "hidden" : ""]} id={id}>
            <span className={"icon tgico tgico-" + icon}/>
            <div className="line">
                <div className="text">{text}</div>
                <div className="label">{label}</div>
            </div>
        </div>
    )
}