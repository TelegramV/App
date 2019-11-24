/**
 * Checks if object is simple component.
 *
 * @param potentialSimpleComponent
 * @returns {boolean}
 */
function vdom_isSimpleComponent(potentialSimpleComponent) {
    return (
        typeof potentialSimpleComponent === "function"
    )
}

export default vdom_isSimpleComponent
