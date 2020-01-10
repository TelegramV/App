import vdom_render from "./render"
import vdom_isVNode from "./check/isVNode"

/**
 * @param vNode
 * @param {Element} $element
 * @param xmlns
 * @return {Element}
 */
function vdom_appendToReal(vNode, $element, {xmlns = null} = {}) {
    const $mountedElement = $element.appendChild(vdom_render(vNode, xmlns))
    if (vdom_isVNode(vNode) && typeof vNode.mounted === "function") {
        vNode.mounted($mountedElement)
    }

    return $mountedElement
}

export default vdom_appendToReal
