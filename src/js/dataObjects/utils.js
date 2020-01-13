export function getLastSeenMessage(timestamp, now) {
    const diff = Math.abs(now - timestamp)

    if (diff < 60) {
        return "just now"
    }

    if (diff < 3600) {
        const minutes = Math.floor(diff / 60);

        if (minutes === 1) {
            return "1 minute ago"
        }

        return `${minutes} minutes ago`
    }

    if (diff < 86400) {
        const hours = Math.floor(diff / 3600);

        if (hours === 1) {
            return "1 hour ago"
        }

        return `${hours} hours ago`
    }

    const days = Math.floor(diff / 86400)

    if (days === 1) {
        return "1 day ago"
    }

    return `${days} days ago`
}