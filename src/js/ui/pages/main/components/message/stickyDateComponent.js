const StickyDateComponent = {
    name: "StickyDateComponent",

    /**
     * @param {Message} message
     * @return {*}
     */
    h({message}) {
        return (
            <div className="service date">
                <div className="service-msg">{message.getDate("en", {
                    month: "long",
                    day: "2-digit"
                })}</div>
            </div>
        )
    }
}

export default StickyDateComponent