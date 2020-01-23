/**
 * Mounts VRNode to $real.
 *
 * @param {VRNode|ComponentVRNode}vNode
 * @param {Element|string} $target
 * @return {Element}
 */
import vrdom_render from "./render"
import {ComponentVRNode} from "./componentVRNode"
import AppFramework from "../framework"

/**
 * @param {Node|Element} $mounted
 */
export function vrdom_mount_resolveComponentMounted($mounted) {
    if ($mounted.nodeType !== Node.TEXT_NODE && $mounted.hasAttribute("data-component-id")) {
        const component = AppFramework.MountedComponents.get($mounted.getAttribute("data-component-id"))

        if (component) {
            component.$el = $mounted

            if (!component.__.mounted) {
                component.__.mounted = true
                component.__mounted()
                component.mounted()
                AppFramework.Plugins.forEach(plugin => plugin.componentMounted(component))
            }
        } else {
            console.error("component was not found. it means that there is a potential bug in the vrdom")
        }
    }
}

function vrdom_mount(vNode, $target) {
    const $mounted = vrdom_realMount(vrdom_render(vNode), $target)

    AppFramework.Plugins.forEach(plugin => plugin.elementMounted($mounted))

    vrdom_mount_resolveComponentMounted($mounted)

    return $mounted
}

/**
 * @param {Element} $node
 * @param {Element|string} $target
 * @return {Element|Node}
 */
export function vrdom_realMount($node, $target) {
    if (typeof $target === "string") {
        $target = document.querySelector($target)
    }

    $target.replaceWith($node)

    return $node
}

export default vrdom_mount