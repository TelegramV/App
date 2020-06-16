/*
 * Telegram V
 * Copyright (C) 2020 Davyd Kohut
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
        if (v) {
            $el.style.setProperty(k, v)
            $el.__v.patched_styles.add(k)
        }
    }

    for (const [k, v] of Object.entries(node.events)) {
        $el[`on${k}`] = v
        $el.__v.patched_events.add(k)
    }

    for (let child of node.children) {
        if (!child) {
            vrdom_append("", $el, {xmlns})
        } else {
            vrdom_append(child, $el, {xmlns, $parent: $el})
        }
    }

    return $el
}

export default renderElement