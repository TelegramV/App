export const ReplyFragment = ({id, name = "...", text = "...", onClick, show = false}) => {
    return (
        <div id={id} className="reply box rp" onClick={onClick} css-display={show ? "" : "none"}>
            <div className="quote">
                <div className="name">{name}</div>
                <div className="text">{text.substring(0, 100)}</div>
            </div>
        </div>
    )
}