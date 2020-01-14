import vdom_render from "./render"

/**
 * @param vNode
 * @param {Element} $element
 * @return {Element}
 */
function vdom_prependToReal(vNode, $element) {
    const $createdElement = vdom_render(vNode)
    $element.prepend($createdElement)

    if (vNode && vNode.component && !vNode.component.__.mounted) {
        vNode.component.$el = $createdElement
        vNode.component.mounted()
    }


    return $createdElement
}

export default vdom_prependToReal
