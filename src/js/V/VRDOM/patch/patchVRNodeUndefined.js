/**
 * (c) Telegram V
 */

const patchVRNodeUndefined = ($node: Element) => {

    if ($node.__component) {
        $node.__component.__unmount()
    }

    $node.remove()

    return undefined
}

export default patchVRNodeUndefined