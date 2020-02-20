/**
 * (c) Telegram V
 */
import vrdom_deleteInner from "../deleteInner"

const patchVRNodeUndefined = ($node: Element) => {

    if ($node.__component) {
        $node.__component.__unmount()
    }

    vrdom_deleteInner($node)

    const $newNode = document.createTextNode("")
    $node.replaceWith($newNode)

    return $newNode
}

export default patchVRNodeUndefined