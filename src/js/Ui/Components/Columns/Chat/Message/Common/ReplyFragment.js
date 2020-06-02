export const ReplyFragment = ({name = null, text = null, show = false, onClick}) => {
    return (
        <div className="reply box rp" css-display={show ? "" : "none"} onClick={onClick}>
            <div className="quote">
                <div className={{
                    "name": true,
                    "loading-text-2": text == null
                }}>{name || "."}</div>
                <div className={{
                    "text": true,
                    "loading-text-2": text == null
                }}>{text ? text.substring(0, 100) : "."}</div>
            </div>
        </div>
    )
}