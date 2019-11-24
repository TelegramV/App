/**
 * Checks if object is virtual node.
 *
 * @param potentialVNode
 * @return {boolean}
 */
function vdom_isVNode(potentialVNode) {
    if (potentialVNode instanceof Node) {
        return false
    }

    return (
        typeof potentialVNode === "object" &&
        potentialVNode.tagName !== undefined &&
        potentialVNode.children !== undefined &&
        potentialVNode.attrs !== undefined &&
        potentialVNode.events !== undefined
    )
}

export default vdom_isVNode
