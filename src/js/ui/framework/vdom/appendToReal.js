import vdom_render from "./render"
import vdom_isNamedComponent from "./check/isNamedComponent"
import AppFramework from "../framework"

/**
 * @param vNode
 * @param {Element} $element
 * @param xmlns
 * @return {Element}
 */
function vdom_appendToReal(vNode, $element, {xmlns = null} = {}) {
    throw new Error("deprecated")
    const $mountedElement = $element.appendChild(vdom_render(vNode, xmlns))

    if (vdom_isNamedComponent(vNode)) {
        const component = AppFramework.mountedComponents.get($mountedElement.getAttribute("data-component-id"))

        component.$el = $mountedElement

        if (!component.__.mounted) {
            component.__.mounted = true
            component.mounted()
        }
    }

    return $mountedElement
}

export default vdom_appendToReal
