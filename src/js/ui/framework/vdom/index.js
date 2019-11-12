/**
 * Simple Virtual DOM
 *
 * @param tagName
 * @param attrs
 * @param options
 * @param events
 * @param children
 * @param htmlChild
 * @returns {any}
 *
 * @author kohutd
 */

export function createElement(tagName, {attrs = {}, options = {}, events = {}, children = [], htmlChild = false} = {}) {
    const vElem = Object.create(null);

    Object.assign(vElem, {
        tagName,
        attrs,
        options,
        events,
        children,
        htmlChild,
    })

    return vElem
}

/**
 * alias for `createElement`
 */
export function h(tagName, {attrs = {}, options = {}, events = {}, children = [], htmlChild = false} = {}) {
    return createElement(tagName, {attrs, options, events, children, htmlChild})
}

/**
 * alias for `createElement`
 */
export function jsx(tagName, conf, ...children) {
    let attrs = {}
    let events = {}
    let options = {}
    let htmlChild = false

    if (conf) {
        for (const [k, v] of Object.entries(conf)) {
            if (k.startsWith("on")) {
                events[k.substring(2).toLowerCase()] = v
            } else if (k === "options") {
                options = Object.assign(options, v)
            } else if (k === "htmlChild") {
                htmlChild = Boolean(v)
            } else {
                attrs[k] = v
            }
        }
    }

    return createElement(tagName, {attrs, options, events, children, htmlChild})
}

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
        $el = new (vNode.tagName)(vNode.options)
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
    createElement,
    h,
    jsx,
    render,
}

export default VDOM