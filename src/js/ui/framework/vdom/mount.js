import vdom_render from "./render"
import vdom_isNamedComponent from "./check/isNamedComponent"
import AppFramework from "../framework"

/**
 * Mounts virtual node to $real.
 *
 * @param vNode
 * @param {Element|string} $target
 * @return {Element}
 */
function vdom_mount(vNode, $target) {
    throw new Error("deprecated")
    const $mounted = vdom_realMount(vdom_render(vNode), $target)

    if (vdom_isNamedComponent(vNode)) {
        const component = AppFramework.mountedComponents.get($mounted.getAttribute("data-component-id"))

        component.$el = $mounted

        if (!component.__.mounted) {
            component.__.mounted = true
            component.mounted()
        }
    }

    if (vNode && vNode.component && !vNode.component.__.mounted) {
        vNode.component.$el = $mounted
        vNode.component.__.mounted = true
        vNode.component.mounted()
    }

    return $mounted
}

/**
 * @param {Element} $node
 * @param {Element|string} $target
 * @param vNode
 * @return {Element|Node}
 */
export function vdom_realMount($node, $target, vNode = undefined) {
    if (typeof $target === "string") {
        $target = document.querySelector($target)
    }

    $target.replaceWith($node)

    return $node
}

export default vdom_mount
