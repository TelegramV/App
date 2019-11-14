/**
 * Creates Virtual Node
 *
 * @param tagName
 * @param attrs element attributes
 * @param constructor used when passed {@link HTMLElement} instance
 * @param options passed when creating element by using {@code document.createElement(tagName, options)}
 * @param events
 * @param children
 * @param htmlChild if true then text children will be rendered by using innerHTML
 * @returns {any}
 */
export function h(tagName, {attrs = {}, constructor = {}, options = {}, events = {}, children = [], htmlChild = false} = {}) {
    const vElem = Object.create(null);

    Object.assign(vElem, {
        tagName,
        attrs,
        constructor,
        options,
        events,
        children,
        htmlChild,
    })

    return vElem
}

export default h