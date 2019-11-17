/**
 * Creates Virtual Node
 *
 * @param tagName
 * @param attrs element attributes
 * @param constructor used when passed {@link HTMLElement} instance
 * @param options passed when creating element by using {@code document.createElement(tagName, options)}
 * @param events
 * @param children
 * @returns {any}
 */
export function h(tagName, {attrs = {}, constructor = {}, options = {}, events = {}, children = []} = {}) {
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
    })

    return vElem
}

export default h
