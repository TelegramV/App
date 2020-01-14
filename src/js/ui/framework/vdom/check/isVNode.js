import {VNode} from "../vNode"

/**
 * Checks if object is virtual node.
 *
 * @param {VNode} potentialVNode
 * @return {boolean}
 */
function vdom_isVNode(potentialVNode) {
    return typeof potentialVNode === "object" && potentialVNode.__virtual
}

export default vdom_isVNode