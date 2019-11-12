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

export function render(vNode) {
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

const VDOM = {
    createElement,
    h,
    render,
}

export default VDOM