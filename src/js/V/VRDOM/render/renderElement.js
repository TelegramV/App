/**
 * (c) Telegram V
 */

import VRNode from "../VRNode"
import type {VRRenderProps} from "../types/types"
import vrdom_append from "../append"
import VF from "../../VFramework"

const _XML_NAMESPACES = new Map([
    ["svg", "http://www.w3.org/2000/svg"]
])

const renderElement = (node: VRNode, props?: VRRenderProps): HTMLElement => {
    let $el: HTMLElement

    let xmlns = undefined

    if (props) {
        xmlns = props.xmlns
    }

    if (node.attrs.xmlns) {
        xmlns = node.attrs.xmlns
        $el = document.createElementNS(xmlns, node.tagName)
    } else if (_XML_NAMESPACES.has(node.tagName)) {
        xmlns = _XML_NAMESPACES.get(node.tagName)
        $el = document.createElementNS(xmlns || "http://www.w3.org/2000/html", node.tagName)
    } else if (xmlns) {
        $el = document.createElementNS(xmlns, node.tagName)
    } else {
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

        $el.innerHTML = node.dangerouslySetInnerHTML
    }

    if (node.ref) {
        $el.__ref = node.ref
    }

    for (let [k, v] of Object.entries(node.attrs)) {
        if (v !== undefined) {
            $el.setAttribute(k, v)
        }
    }

    $el.style.__patched = new Set()

    for (let [k, v] of Object.entries(node.style)) {
        if (v !== undefined) {
            $el.style.setProperty(k, v)
            $el.style.__patched.add(k)
        }
    }

    for (const [k, v] of node.events.entries()) {
        $el[`on${k}`] = v
    }

    for (let child of node.children) {
        if (child === null) {
            vrdom_append("", $el, {xmlns})
        } else {
            vrdom_append(child, $el, {xmlns})
        }
    }

    VF.plugins.forEach(plugin => plugin.elementCreated($el))

    return $el
}

export default renderElement