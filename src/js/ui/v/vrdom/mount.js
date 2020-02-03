import vrdom_render from "./render/render"
import type VRNode from "./VRNode"
import type {VRRenderProps} from "./types/types"
import V from "../VFramework"

export function vrdom_mount_resolveComponentMounted($mounted: Element) {
    if ($mounted.nodeType !== Node.TEXT_NODE && $mounted.hasAttribute("data-component-id")) {
        const component = V.mountedComponents.get($mounted.getAttribute("data-component-id"))

        if (component) {
            component.$el = $mounted

            if (!component.__.mounted) {
                component.__.mounted = true
                component.__mounted()
                component.mounted()
                V.plugins.forEach(plugin => plugin.componentMounted(component))
            }
        } else {
            console.error("component was not found. it means that there is a potential bug in the vrdom")
        }
    }
}

/**
 * Mounts VRNode to Real DOM Element
 *
 * @param node
 * @param $el
 * @param props
 */
function vrdom_mount(node: VRNode, $el: Element | Node | Text, props?: VRRenderProps): Element | Node | Text {
    const $mounted = vrdom_realMount(vrdom_render(node, props), $el)

    if ($mounted.nodeType === Node.TEXT_NODE) {
        V.plugins.forEach(plugin => plugin.textMounted($mounted))
    } else {
        V.plugins.forEach(plugin => plugin.elementMounted($mounted))
    }

    vrdom_mount_resolveComponentMounted($mounted)

    return $mounted
}

export function vrdom_realMount($el: Element | Node | Text, $target: Element | Node | Text): Element {
    if (typeof $target === "string") {
        $target = document.querySelector($target)
    }

    // $ignore
    $target.replaceWith($el)

    // $ignore
    return $el
}

export default vrdom_mount