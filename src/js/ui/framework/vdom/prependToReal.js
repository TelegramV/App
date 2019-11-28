import vdom_render from "./render"

/**
 * @param vNode
 * @param {Element} $element
 * @return {Element}
 */
function vdom_prependToReal(vNode, $element) {
    const $createdElement = vdom_render(vNode)
    $element.prepend($createdElement)
    if (typeof vNode.mounted === "function") {
        vNode.mounted($createdElement)
    }
    return $createdElement
}

export default vdom_prependToReal
