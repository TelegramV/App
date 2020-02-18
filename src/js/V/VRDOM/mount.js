/**
 * (c) Telegram V
 */

import vrdom_render from "./render/render"
import type VRNode from "./VRNode"
import type {VRRenderProps} from "./types/types"
import VF from "../VFramework"
import Component from "./Component"
import {VComponent} from "./component/VComponent"
import XVComponent from "../X/Component/XVComponent"

export function vrdom_resolveMount($mounted: Element) {
    if ($mounted.nodeType !== Node.TEXT_NODE) {
        if ($mounted.__component) {
            const component = $mounted.__component

            if (component instanceof Component) {
                component.$el = $mounted

                if (!component.__.mounted) {
                    component.__.mounted = true
                    component.__mounted()
                    component.mounted()
                    VF.plugins.forEach(plugin => plugin.componentMounted(component))
                }
            } else if (component instanceof VComponent) {
                component.__mount($mounted)
            } else if (component instanceof XVComponent) {
                component.__mount.call(component, $mounted)
            } else {
                console.error("component was not found. it means that there is a potential bug in the vrdom")
            }
        } else if ($mounted.__ref && !$mounted.__ref.__component_ref) {
            $mounted.__ref.$el = $mounted
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
        VF.plugins.forEach(plugin => plugin.textMounted($mounted))
    } else {
        VF.plugins.forEach(plugin => plugin.elementMounted($mounted))
    }

    vrdom_resolveMount($mounted)

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