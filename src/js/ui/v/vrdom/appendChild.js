import vrdom_render from "./render"
import {vrdom_mount_resolveComponentMounted} from "./mount"
import V from "../VFramework"

/**
 * @param vNode
 * @param {Element} $element
 * @param xmlns
 * @return {Element}
 */
function vrdom_append(vNode, $element, {xmlns = null} = {}) {
    const $mounted = $element.appendChild(vrdom_render(vNode, xmlns))

    if ($mounted.nodeType === Node.TEXT_NODE) {
        V.plugins.forEach(plugin => plugin.textMounted($mounted))
    } else {
        V.plugins.forEach(plugin => plugin.elementMounted($mounted))
    }

    vrdom_mount_resolveComponentMounted($mounted)

    return $mounted
}

export default vrdom_append
