/**
 * Checks if object is named component.
 *
 * @param potentialNamedComponent
 * @returns {boolean}
 */
function bvdom_isComponent(potentialNamedComponent) {
    throw new Error("deprecated")
    return (
        typeof potentialNamedComponent === "object" &&
        typeof potentialNamedComponent.name === "string" &&
        potentialNamedComponent.name.length > 0 &&
        typeof potentialNamedComponent.h === "function"
    )
}

export default bvdom_isComponent