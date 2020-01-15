import vdom_render from "./render"

/**
 * Mounts virtual node to $real.
 *
 * @param vNode
 * @param {Element|string} $target
 * @return {Element}
 */
function vdom_mount(vNode, $target) {
    const $mounted = vdom_realMount(vdom_render(vNode), $target)

    if (vNode && vNode.component && !vNode.component.__.mounted) {
        vNode.component.$el = $mounted
        vNode.component.mounted()
    }

    return $mounted
}

/**
 * @param {Element} $node
 * @param {Element|string} $target
 * @param vNode
 * @return {Element}
 */
export function vdom_realMount($node, $target, vNode = undefined) {
    if (typeof $target === "string") {
        $target = document.querySelector($target)
    }

    $target.replaceWith($node)

    return $node
}

export default vdom_mount
