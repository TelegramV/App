/**
 * Checks if object is virtual node.
 *
 * @param potentialVNode
 * @return {boolean}
 */
function vdom_isVNode(potentialVNode) {
    return typeof potentialVNode === "object" && potentialVNode.__virtual
}

export default vdom_isVNode