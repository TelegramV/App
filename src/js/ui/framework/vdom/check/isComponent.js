import vdom_isSimpleComponent from "./isSimpleComponent"
import vdom_isNamedComponent from "./isNamedComponent"

/**
 * Checks if object is either simple or named component.
 *
 * @param potentialComponent
 * @returns {boolean}
 */
function vdom_isComponent(potentialComponent) {
    throw new Error("deprecated")
    return (
        vdom_isSimpleComponent(potentialComponent) ||
        vdom_isNamedComponent(potentialComponent)
    )
}

export default vdom_isComponent
