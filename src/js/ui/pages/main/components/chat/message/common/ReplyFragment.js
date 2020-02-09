export const ReplyFragment = ({id, name = "...", text = "...", show = false, onClick}) => {
    return (
        <div id={id} className="reply box rp" css-display={show ? "" : "none"} onClick={onClick}>
            <div className="quote">
                <div className="name">{name}</div>
                <div className="text">{text.substring(0, 100)}</div>
            </div>
        </div>
    )
}