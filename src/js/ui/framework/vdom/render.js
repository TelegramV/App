import vdom_isVNode from "./check/isVNode"
import vdom_appendToReal from "./appendToReal"
import vdom_isNamedComponent from "./check/isNamedComponent"
import vdom_renderNamedComponent from "./renderNamedComponent"

const _XML_NAMESPACES = new Map([
    ["svg", "http://www.w3.org/2000/svg"]
])

/**
 * Renders Virtual DOM Node
 *
 * @param vNode
 * @param xmlns
 * @returns {Text|HTMLElement}
 */
function vdom_render(vNode, xmlns = null) {
    throw new Error("deprecated")
    if (vdom_isNamedComponent(vNode)) {
        return vdom_renderNamedComponent(vNode)
    }

    if (vNode instanceof Node) {
        throw new Error("Cannot render real node as virtual..")
    }

    if (!vNode || typeof vNode === "undefined") {
        return document.createTextNode(vNode)
    }

    // means that the object is not a virtual node, so we just convert it to json
    if (typeof vNode === "object" && !vdom_isVNode(vNode)) {
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

    // if (vNode.options && Object.keys(vNode.options) > 0) {
    //     $node = document.createElement(vNode.tagName, options)
    // } else {

    if (vNode.attrs.xmlns) {
        xmlns = vNode.attrs.xmlns
        $node = document.createElementNS(xmlns, vNode.tagName)
    } else if (_XML_NAMESPACES.has(vNode.tagName)) {
        xmlns = _XML_NAMESPACES.get(vNode.tagName)
        $node = document.createElementNS(xmlns, vNode.tagName)
    } else if (xmlns) {
        $node = document.createElementNS(xmlns, vNode.tagName)
    } else {
        $node = document.createElement(vNode.tagName)
    }
    // }

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
    for (const [kEvent, vEvent] of vNode.events.entries()) {
        $node.addEventListener(kEvent, vEvent)
    }

    if (vNode.component) {
        vNode.component.$el = $node

        if (!vNode.component.__.created) {
            vNode.component.created($node)
        }
    }

    // appending children
    for (const child of vNode.children) {
        vdom_appendToReal(child, $node, {xmlns})
    }

    return $node
}

export default vdom_render
