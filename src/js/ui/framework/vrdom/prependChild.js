import vrdom_render from "./render"
import {vrdom_mount_resolveComponentMounted} from "./mount"
import AppFramework from "../framework"

/**
 * @param vNode
 * @param {Element} $element
 * @param xmlns
 * @return {Element}
 */
function vrdom_prepend(vNode, $element, {xmlns = null} = {}) {
    const $node = vrdom_render(vNode, xmlns)

    $element.prepend($node)

    AppFramework.Plugins.forEach(plugin => plugin.elementMounted($node))

    vrdom_mount_resolveComponentMounted($node)

    return $node
}

export default vrdom_prepend
