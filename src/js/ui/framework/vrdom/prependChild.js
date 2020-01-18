import vrdom_render from "./render"
import {vrdom_mount_resolveComponentMounted} from "./mount"

/**
 * @param vNode
 * @param {Element} $element
 * @param xmlns
 * @return {Element}
 */
function vrdom_prepend(vNode, $element, {xmlns = null} = {}) {
    $element.prepend(vrdom_render(vNode, xmlns))

    vrdom_mount_resolveComponentMounted($element)

    return $element
}

export default vrdom_prepend
