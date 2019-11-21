const _XML_NAMESPACES = {
    svg: "http://www.w3.org/2000/svg"
}

/**
 * Renders Virtual DOM Node
 *
 * @param vNode
 * @param xmlns
 * @returns {Text|HTMLElement}
 */
export function vdom_render(vNode, xmlns = null) {
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

    let $node = null

    if (vNode.options && Object.keys(vNode.options) > 0) {
        $node = document.createElement(vNode.tagName, options)
    } else {
        if (vNode.attrs.xmlns) {
            xmlns = vNode.attrs.xmlns
            $node = document.createElementNS(xmlns, vNode.tagName)
        } else if (_XML_NAMESPACES.hasOwnProperty(vNode.tagName)) {
            xmlns = _XML_NAMESPACES[vNode.tagName]
            $node = document.createElementNS(xmlns, vNode.tagName)
        } else if (xmlns) {
            $node = document.createElementNS(xmlns, vNode.tagName)
        } else {
            $node = document.createElement(vNode.tagName)
        }
    }

    // check if innerHTML should be set
    if (vNode.dangerouslySetInnerHTML !== false) {

        if (Array.isArray(vNode.children)) {
            if (vNode.children.length > 0) {
                console.error(vNode)
                throw new Error("Element with `dangerouslySetInnerHTML` should not have children.")
            }
        } else if (vNode.children) {
            console.error(vNode)
            throw new Error("Element with `dangerouslySetInnerHTML` should not have children.")
        }

        $node.innerHTML = vNode.dangerouslySetInnerHTML
    }

    // setting attributes
    for (const [k, v] of Object.entries(vNode.attrs)) {
        if (Array.isArray(v)) {
            $node.setAttribute(k, v.join(" "))
        } else {
            $node.setAttribute(k, v)
        }
    }

    // adding events
    for (const [kEvent, vEvent] of Object.entries(vNode.events)) {
        $node.addEventListener(kEvent, vEvent)
    }

    // append children
    for (const child of vNode.children) {
        $node.appendChild(vdom_render(child, xmlns))
    }

    return $node
}

export default vdom_render
