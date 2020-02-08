import VRNode from "../VRNode"
import type {VRRenderProps} from "../types/types"
import vrdom_append from "../append"
import VF from "../../VFramework"
import {VListVRNode} from "../VListVRNode"

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

    if ($el instanceof HTMLInputElement || $el instanceof HTMLTextAreaElement) {
        for (let [k, v] of Object.entries(node.attrs)) {
            if (k === "value") {
                $el.value = v
            } else if (k === "ref" && !v.__component_ref) {
                $el.__ref = v
            } else if (v !== undefined) {
                $el.setAttribute(k, v)
            }
        }
    } else {
        for (let [k, v] of Object.entries(node.attrs)) {
            if (k === "ref" && !v.__component_ref) {
                $el.__ref = v
            } else if (v !== undefined) {
                $el.setAttribute(k, v)
            }
        }
    }

    for (const [k, v] of node.events.entries()) {
        $el[`on${k}`] = v
    }

    if ($el instanceof HTMLTextAreaElement) {
        return $el
    } else {
        for (let child of node.children) {
            if (child instanceof VListVRNode) {
                const list = new (child.list)({list: child.items, template: child.template})
                list.$parent = $el
                const items = list.render()
                items.forEach(item => vrdom_append(item, $el, {xmlns}))
            } else {
                vrdom_append(child, $el, {xmlns})
            }
        }
    }

    VF.plugins.forEach(plugin => plugin.elementCreated($el))

    return $el
}

export default renderElement