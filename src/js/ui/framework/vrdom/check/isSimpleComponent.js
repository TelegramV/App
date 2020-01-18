/**
 * Checks if given object is a simple component.
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
