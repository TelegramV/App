/**
 * Renders Virtual DOM Node
 *
 * @param vNode
 * @returns {Text|HTMLElement}
 */
export function vdom_render(vNode) {
    if (!vNode || typeof vNode === "undefined") {
        return document.createTextNode(vNode)
    }

    // means that the object is not a virtual node, so we just convert it to json
    if (typeof vNode === "object" && !vNode.tagName) {
        return document.createTextNode(JSON.stringify(vNode))
    }

    // means that the vNode is either string or number or something else but not virtual node
    if (typeof vNode !== "object" && typeof vNode !== "function") {
        return document.createTextNode(vNode)
    }

    // should be removed in future
    if (Array.isArray(vNode)) {
        throw new Error("wtf")
    }

    let $el = null

    if (vNode.options && Object.keys(vNode.options) > 0) {
        $el = document.createElement(vNode.tagName, options)
    } else {
        $el = document.createElement(vNode.tagName)
    }

    // check if innerHTML should be set
    if (vNode.attrs && vNode.attrs.hasOwnProperty("dangerouslySetInnerHTML")) {

        if (Array.isArray(vNode.children)) {
            if (vNode.children.length > 0) {
                console.error(vNode)
                throw new Error("Element with `dangerouslySetInnerHTML` should not have children.")
            }
        } else if (vNode.children) {
            console.error(vNode)
            throw new Error("Element with `dangerouslySetInnerHTML` should not have children.")
        }

        $el.innerHTML = vNode.attrs["dangerouslySetInnerHTML"]
        delete vNode.attrs["dangerouslySetInnerHTML"]
    }

    // setting attributes
    for (const [k, v] of Object.entries(vNode.attrs)) {
        if (Array.isArray(v)) {
            $el.setAttribute(k, v.join(" "))
        } else {
            $el.setAttribute(k, v)
        }
    }

    // adding events
    for (const [kEvent, vEvent] of Object.entries(vNode.events)) {
        $el.addEventListener(kEvent, vEvent)
    }

    // append children
    for (const child of vNode.children) {
        $el.appendChild(vdom_render(child))
    }

    return $el
}

export default vdom_render
