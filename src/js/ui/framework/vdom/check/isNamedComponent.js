/**
 * Checks if object is named component.
 *
 * @param potentialNamedComponent
 * @returns {boolean}
 */
function vdom_isNamedComponent(potentialNamedComponent) {
    return (
        typeof potentialNamedComponent === "object" &&
        typeof potentialNamedComponent.name === "string" &&
        potentialNamedComponent.name.length > 0 &&
        typeof potentialNamedComponent.h === "function"
    )
}

export default vdom_isNamedComponent
