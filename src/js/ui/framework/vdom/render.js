import VDOM from "./index"

/**
 * Renders Virtual DOM Node
 *
 * @param vNode
 * @returns {Text|HTMLElement|any|Node|string|[]}
 */
export function render(vNode) {
    if (!vNode) {
        return document.createTextNode(vNode)
    }

    if (Array.isArray(vNode)) {
        throw new Error("wtf")
    }

    if (vNode.attrs && vNode.attrs.hasOwnProperty("dangerouslySetInnerHTML")) {
        const $el = document.createElement(vNode.tagName)
        $el.innerHTML = vNode.attrs["dangerouslySetInnerHTML"]
        return $el
    }


    if (typeof vNode !== "object" && typeof vNode !== "function") {
        return document.createTextNode(vNode)
    }

    let $el = null
    let isFrameworkObject = false
    if (typeof vNode.tagName === "object") {
        isFrameworkObject = true
        const component = vNode.tagName

        let prevRendered = component.h()
        $el = render(prevRendered)
        component.mounted()
        component.render = () => {
            const rendered = component.h()
            if (prevRendered !== rendered) {
                const patch = VDOM.diff(prevRendered, rendered)
                $el = patch($el)
                prevRendered = rendered;
                component.updated()
            }
        }
    } else {
        if (vNode.options && Object.keys(vNode.options) > 0) {
            $el = document.createElement(vNode.tagName, options)
        } else {
            $el = document.createElement(vNode.tagName)
        }
    }

    for (const [k, v] of Object.entries(vNode.attrs)) {
        if (Array.isArray(v)) {
            $el.setAttribute(k, v.join(" "))
        } else {
            $el.setAttribute(k, v)
        }
    }

    for (const [kEvent, vEvent] of Object.entries(vNode.events)) {
        $el.addEventListener(kEvent, vEvent)
    }

    if (isFrameworkObject && vNode.children.length > 0) {
        throw new Error("delete children")
    }

    for (const child of vNode.children) {
        $el.appendChild(render(child))
    }

    return $el
}

export default render
