/**
 * Creates Virtual Node
 *
 * @param tagName
 * @param attrs element attributes
 * @param constructor used when passed {@link HTMLElement} instance
 * @param options passed when creating element by using {@code document.createElement(tagName, options)}
 * @param events
 * @param children
 * @param dangerouslySetInnerHTML
 * @returns {any}
 */
export function vdom_h(tagName, {attrs = {}, constructor = {}, options = {}, events = {}, children = [], dangerouslySetInnerHTML = false} = {}) {
    const vElem = Object.create(null);

    if (typeof tagName === "function") {
        tagName = (new (tagName)(constructor))
    }

    if (tagName === "a" && !attrs.target) {
        attrs.target = "_blank"
    }
    // console.warn(tagName)

    Object.assign(vElem, {
        tagName,
        attrs,
        constructor,
        options,
        events,
        children,
        dangerouslySetInnerHTML
    })

    return vElem
}

export default vdom_h
