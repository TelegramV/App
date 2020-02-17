/**
 * (c) Telegram V
 */

const classAttrProcessor = value => {
    if (Array.isArray(value)) {
        return value.join(" ")
    } else if (typeof value === "object") {
        return Object.entries(value)
            .filter(attr => attr[1])
            .map(attr => attr[0])
            .join(" ")
    } else {
        return value
    }
}

export default classAttrProcessor