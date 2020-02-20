export const highlightVRNodeWord = (text: string, str: string) => {
    if (!str) {
        return text
    }

    const originalText = text

    text = text.toLowerCase()
    str = str.toLowerCase()

    const position = text.search(str)

    if (position === -1) {
        return originalText
    }

    let before = originalText.substring(0, position)
    if (before.length > 30) {
        before = "..." + before.substring(before.length - 20, before.length)
    }

    const found = originalText.substring(position, position + str.length)

    let after = originalText.substring(position + str.length)
    if (after.length > 30) {
        after = after.substring(0, 30) + "..."
    }

    return <span>{before}<span class="color-blue">{found}</span>{after}</span>
}