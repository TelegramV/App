import vdom_render from "./render"

/**
 * @param {VNode} vNode
 * @param {Element} $element
 * @param xmlns
 * @return {Element}
 */
function vdom_appendToReal(vNode, $element, {xmlns = null} = {}) {
    const $mountedElement = $element.appendChild(vdom_render(vNode, xmlns))

    if (vNode && vNode.component && !vNode.component.__.mounted) {
        vNode.component.$el = $mountedElement
        vNode.component.mounted()
    }

    return $mountedElement
}

export default vdom_appendToReal
