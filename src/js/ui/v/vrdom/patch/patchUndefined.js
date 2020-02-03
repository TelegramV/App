const patchUndefined = ($node: Element) => {
    if ($node.nodeType === Node.TEXT_NODE) {
        // $ignore
        $node.remove()
        // $ignore
        return undefined
    }

    if ($node.__component) {
        // console.log("[patch undefined] $node component")

        // $ignore
        $node.__component.__delete()

    } else {
        // $ignore
        $node.remove()
    }

    // $ignore
    return undefined
}

export default patchUndefined