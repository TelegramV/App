export function getLastSeenMessage(timestamp, now) {
    const diff = Math.abs(now - timestamp)

    if (diff < 60) {
        return "just now"
    }
    if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes} minutes ago`
    }
    if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} hours ago`
    }
    const days = Math.floor(diff / 86400)
    return `${days} days ago`
}