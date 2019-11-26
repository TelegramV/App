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
 * @return {Element}
 */
export function vdom_realMount($node, $target) {
    if (typeof $target === "string") {
        $target = document.querySelector($target)
    }

    $target.replaceWith($node)
    return $node
}

export default vdom_mount
