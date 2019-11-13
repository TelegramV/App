/*
    Simple Virtual DOM

    @author kohutd
 */

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

/**
 * translator (kostyl') for jsx
 *
 * @param tagName
 * @param attributes
 * @param children
 * @returns {any}
 */
export function jsx(tagName, attributes, ...children) {
    let attrs = {}
    let events = {}
    let options = {}
    let constructor = {}
    let htmlChild = false

    if (attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            if (k.startsWith("on")) {
                events[k.substring(2).toLowerCase()] = v
            } else if (k === "options") {
                options = Object.assign(options, v)
            } else if (k === "constructor") {
                constructor = Object.assign(options, v)
            } else if (k === "htmlChild") {
                htmlChild = Boolean(v)
            } else {
                attrs[k] = v
            }
        }
    }

    return h(tagName, {attrs, constructor, options, events, children, htmlChild,})
}

/**
 * Renders Virtual DOM Node
 *
 * @param vNode
 * @returns {Text|HTMLElement|any}
 */
export function render(vNode) {

    if (Array.isArray(vNode)) {
        const $el = document.createElement("div")
        vNode.forEach(vNodeIn => {
            $el.appendChild(render(vNodeIn))
        })
        return $el
    }

    if (!vNode) return document.createTextNode("")

    if (vNode.htmlChild) {
        const $el = document.createElement(vNode.tagName)
        $el.innerHTML = vNode.children
        return $el
    }

    if (typeof vNode === "string") {
        return document.createTextNode(vNode)
    }
    let $el = null
    if (typeof vNode.tagName === "function") {
        $el = new (vNode.tagName)(vNode.constructor)
    } else {
        if (vNode.options && Object.keys(vNode.options) > 0) {
            $el = document.createElement(vNode.tagName, options)
        } else {
            $el = document.createElement(vNode.tagName)
        }
    }

    for (const [k, v] of Object.entries(vNode.attrs)) {
        $el.setAttribute(k, v)
    }

    for (const [kEvent, vEvent] of Object.entries(vNode.events)) {
        $el.addEventListener(kEvent, vEvent)
    }

    for (const child of vNode.children) {
        $el.appendChild(render(child))
    }

    return $el
}

export const VDOM = {
    h,
    jsx,
    render,
}

export default VDOM