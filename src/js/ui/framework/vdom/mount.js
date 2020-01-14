import vdom_render from "./render"

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
 * @param {VNode} vNode
 * @return {Element}
 */
export function vdom_realMount($node, $target, vNode = undefined) {
    if (typeof $target === "string") {
        $target = document.querySelector($target)
    }

    $target.replaceWith($node)

    if (vNode && vNode.component && !vNode.component.__.mounted) {
        vNode.component.$el = $node
        vNode.component.mounted()
    }

    return $node
}

export default vdom_mount
