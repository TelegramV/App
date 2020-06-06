function StickyDateFragment({message}) {
    return (
        <div className="service date">
            <div className="service-msg">{message.getDate("en", {
                month: "long",
                day: "2-digit"
            })}</div>
        </div>
    )
}

export default StickyDateFragment