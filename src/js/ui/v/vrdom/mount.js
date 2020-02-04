import vrdom_render from "./render/render"
import type VRNode from "./VRNode"
import type {VRRenderProps} from "./types/types"
import V from "../VFramework"
import Component from "./Component"
import {VComponent} from "./component/VComponent"

export function vrdom_mount_resolveComponentMounted($mounted: Element) {
    if ($mounted.nodeType !== Node.TEXT_NODE && $mounted.__component) {
        const component = $mounted.__component

        if (component instanceof Component) {
            component.$el = $mounted

            if (!component.__.mounted) {
                component.__.mounted = true
                component.__mounted()
                component.mounted()
                V.plugins.forEach(plugin => plugin.componentMounted(component))
            }
        } else if (component instanceof VComponent) {
            component.__mount($mounted)
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

    $target.replaceWith($el)

    return $el
}

export default vrdom_mount