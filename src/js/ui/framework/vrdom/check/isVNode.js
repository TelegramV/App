/**
 * Checks if object is virtual node.
 *
 * @param potentialVNode
 * @return {boolean}
 */
import {VRNode} from "../VRNode"

function vdom_isVNode(potentialVNode) {
    return typeof potentialVNode instanceof VRNode
}

export default vdom_isVNode