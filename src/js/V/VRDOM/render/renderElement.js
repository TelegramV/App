/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import VRNode from "../VRNode"
import type {VRenderProps} from "../types/types"
import vrdom_append from "../append"

const SVG_W3 = "http://www.w3.org/2000/svg"
const XML_NAMESPACES = new Map([
    ["svg", SVG_W3],
])

export function initElement($el: HTMLElement) {
    if (!$el.__v) {
        $el.__v = Object.create(null)
        $el.__v.patched_styles = new Set()
        $el.__v.patched_events = new Set()
    } else {
        if (!($el.__v.patched_styles instanceof Set)) {
            $el.__v.patched_styles = new Set()
        }

        if (!($el.__v.patched_events instanceof Set)) {
            $el.__v.patched_events = new Set()
        }
    }
}

const renderElement = (node: VRNode, props: VRenderProps = {}): HTMLElement => {
    let $el: HTMLElement

    let xmlns = props.xmlns

    if (node.attrs.xmlns) {
        xmlns = node.attrs.xmlns
        $el = document.createElementNS(xmlns, node.tagName)
    } else if (XML_NAMESPACES.has(node.tagName)) {
        xmlns = XML_NAMESPACES.get(node.tagName)
        $el = document.createElementNS(xmlns || "http://www.w3.org/2000/html", node.tagName)
    } else if (xmlns) {
        $el = document.createElementNS(xmlns, node.tagName)
    } else {
        $el = document.createElement(node.tagName)
    }

    initElement($el)

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
        if (node.ref.__ref || node.ref.__fragment_ref) {
            node.ref.$el = $el
        }
    }

    for (let [k, v] of Object.entries(node.attrs)) {
        if (v != null) {
            $el.setAttribute(k, v)
        }
    }

    for (let [k, v] of Object.entries(node.style)) {
        if (v != null) {
            $el.style.setProperty(k, v)
            $el.__v.patched_styles.add(k)
        }
    }

    for (const [k, v] of Object.entries(node.events)) {
        $el[`on${k}`] = v
        $el.__v.patched_events.add(k)
    }

    for (let child of node.children) {
        if (child === null) {
            vrdom_append("", $el, {xmlns})
        } else if (child !== undefined) {
            vrdom_append(child, $el, {xmlns, $parent: $el})
        }
    }

    return $el
}

export default renderElement