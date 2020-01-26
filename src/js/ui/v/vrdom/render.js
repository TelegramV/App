import {ComponentVRNode} from "./componentVRNode"
import {VRNode} from "./VRNode"
import vrdom_renderComponentVNode from "./renderComponent"
import vrdom_append from "./appendChild"
import V from "../VFramework"

const _XML_NAMESPACES = new Map([
    ["svg", "http://www.w3.org/2000/svg"]
])

/**
 * @param {VRNode|ComponentVRNode} vNode
 * @param xmlns
 * @return {Element|Node}
 */
function vrdom_render(vNode, xmlns = null) {
    if (vNode instanceof ComponentVRNode) {
        return vrdom_renderComponentVNode(vNode)
    }

    if (vNode instanceof VRNode) {
        // console.log("virtual node", vNode)

        let $node = undefined

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

        if (vNode.dangerouslySetInnerHTML !== false) {

            if (Array.isArray(vNode.children)) {
                if (vNode.children.length > 0) {
                    console.error(vNode)
                    throw new Error("Element with `dangerouslySetInnerHTML` must not have children.")
                }
            } else if (vNode.children) {
                console.error(vNode)
                throw new Error("Element with `dangerouslySetInnerHTML` must not have children.")
            }

            $node.innerHTML = vNode.dangerouslySetInnerHTML

        }

        for (const [k, v] of Object.entries(vNode.attrs)) {
            if (v !== undefined) {
                $node.setAttribute(k, v)
            }
        }

        for (const [k, v] of vNode.events.entries()) {
            $node[`on${k}`] = v
        }

        V.plugins.forEach(plugin => plugin.elementCreated($node))

        for (const child of vNode.children) {
            vrdom_append(child, $node, {xmlns})
        }

        return $node
    } else if (!vNode) {
        return document.createTextNode(String(vNode))
    } else {
        if (typeof vNode === "object") {
            return document.createTextNode(JSON.stringify(vNode))
        } else {
            return document.createTextNode(String(vNode))
        }
    }
}

export default vrdom_render