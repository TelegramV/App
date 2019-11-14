/**
 * Renders Virtual DOM Node
 *
 * @param vNode
 * @returns {Text|HTMLElement|any|Node|string}
 */
export function render(vNode) {
    if (Array.isArray(vNode)) {
        throw new Error("FUCK THIS SHIT")
        // const $el = document.createElement("div")
        // vNode.forEach(vNodeIn => {
        //     $el.appendChild(render(vNodeIn))
        // })
        // return $el
    }

    if (vNode.htmlChild) {
        const $el = document.createElement(vNode.tagName)
        $el.innerHTML = vNode.children
        return $el
    }


    if (typeof vNode !== "object" && typeof vNode !== "function") {
        return document.createTextNode(vNode)
    }

    let $el = null
    let isFrameworkObject = false
    if (typeof vNode.tagName === "function") {
        isFrameworkObject = true
        $el = (new (vNode.tagName)(vNode.constructor)).get$node()
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

    if (isFrameworkObject && vNode.children.length > 0) {
        throw new Error("delete children")
    }

    for (const child of vNode.children) {
        $el.appendChild(render(child))
    }

    return $el
}

export default render