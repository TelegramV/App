import vdom_render from "./render"
import vdom_isVNode from "./check/isVNode"

/**
 * Mounts virtual node to $real.
 *
 * @param vNode
 * @param {Element|string} $target
 * @return {Element}
 */
function vdom_mount(vNode, $target) {
    return vdom_realMount(vdom_render(vNode), $target)
}

/**
 * @param {Element} $node
 * @param {Element|string} $target
 * @return {Element}
 */
export function vdom_realMount($node, $target, vNode = undefined) {
    if (typeof $target === "string") {
        $target = document.querySelector($target)
    }

    $target.replaceWith($node)

    if (vNode !== undefined && vdom_isVNode(vNode) && typeof vNode.mounted === "function") {
        vNode.mounted($node)
    }

    return $node
}

export default vdom_mount
