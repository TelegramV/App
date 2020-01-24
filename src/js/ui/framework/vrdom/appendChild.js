import vrdom_render from "./render"
import {vrdom_mount_resolveComponentMounted} from "./mount"
import AppFramework from "../framework"

/**
 * @param vNode
 * @param {Element} $element
 * @param xmlns
 * @return {Element}
 */
function vrdom_append(vNode, $element, {xmlns = null} = {}) {
    const $mounted = $element.appendChild(vrdom_render(vNode, xmlns))

    AppFramework.Plugins.forEach(plugin => plugin.elementMounted($mounted))

    vrdom_mount_resolveComponentMounted($mounted)

    return $mounted
}

export default vrdom_append
