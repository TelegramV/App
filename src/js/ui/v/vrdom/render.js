import ComponentVRNode from "./ComponentVRNode"
import VRNode from "./VRNode"
import type {VRRenderProps} from "./types/types"
import vrdom_renderComponentVNode from "./renderComponent"
import vrdom_append from "./append"
import V from "../VFramework"

const _XML_NAMESPACES = new Map([
    ["svg", "http://www.w3.org/2000/svg"]
])

/**
 * Creates Real DOM Element from VRNode
 *
 * @param node
 * @param props
 */
function vrdom_render(node: VRNode | ComponentVRNode, props?: VRRenderProps) : Element | Node | Text {
    if (node instanceof ComponentVRNode) {
        return vrdom_renderComponentVNode(node)
    }

    let xmlns = undefined

    if (props) {
        xmlns = props.xmlns
    }

    if (node instanceof VRNode) {
        let $el: Element

        if (node.attrs.xmlns) {
            xmlns = node.attrs.xmlns
            // $ignore
            $el = document.createElementNS(xmlns, node.tagName)
        } else if (_XML_NAMESPACES.has(node.tagName)) {
            xmlns = _XML_NAMESPACES.get(node.tagName)
            // $ignore
            $el = document.createElementNS(xmlns || "http://www.w3.org/2000/html", node.tagName)
        } else if (xmlns) {
            // $ignore
            $el = document.createElementNS(xmlns, node.tagName)
        } else {
            // $ignore
            $el = document.createElement(node.tagName)
        }

        if (node.dangerouslySetInnerHTML !== false) {

            if (Array.isArray(node.children)) {
                if (node.children.length > 0) {
                    console.error(node)
                    throw new Error("Element with `dangerouslySetInnerHTML` must not have children.")
                }
            } else if (node.children) {
                console.error(node)
                throw new Error("Element with `dangerouslySetInnerHTML` must not have children.")
            }

            $el.innerHTML = String(node.dangerouslySetInnerHTML)

        }

        for (const [k, v] of Object.entries(node.attrs)) {
            if (v !== undefined) {
                $el.setAttribute(k, String(v))
            }
        }

        for (const [k, v] of node.events.entries()) {
            // $ignore
            $el[`on${k}`] = v
        }

        for (const child of node.children) {
            vrdom_append(child, $el, {xmlns})
        }

        V.plugins.forEach(plugin => plugin.elementCreated($el))

        return $el
    } else if (!node) {
        return document.createTextNode(String(node))
    } else {
        if (typeof node === "object") {
            const $node = document.createTextNode(JSON.stringify(node))
            V.plugins.forEach(plugin => plugin.textCreated($node))
            return $node
        } else {
            const $node = document.createTextNode(String(node))
            V.plugins.forEach(plugin => plugin.textCreated($node))
            return $node
        }
    }
}

export default vrdom_render