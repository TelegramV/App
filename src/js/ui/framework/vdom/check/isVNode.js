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
        potentialVNode.__virtual === true
    )
}

export default vdom_isVNode
