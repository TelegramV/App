/**
 * (c) Telegram V
 */

const patchUndefined = ($node: Element) => {
    if ($node.nodeType === Node.TEXT_NODE) {
        $node.remove()
        return undefined
    }

    if ($node.__component) {
        // console.log("[patch undefined] $node component")

        $node.__component.__delete()

    } else {
        $node.remove()
    }

    return undefined
}

export default patchUndefined