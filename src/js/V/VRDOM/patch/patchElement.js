/*
 * Telegram V
 * Copyright (C) 2020 original authors
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

import patchAttrs from "./patchAttrs"
import patchDangerouslySetInnerHTML from "./patchDangerouslySetInnerHTML"
import vrdom_patchChildren from "./patchChildren"
import VRNode from "../VRNode"
import patch_Text_VRNode from "./patch_Text_VRNode"
import {initElement} from "../render/renderElement"
import VApp from "../../vapp"
import patchEvents from "./patchEvents"
import patchStyle from "./patchStyle"

const recreateElementByTagName = ($node: HTMLElement, tagName: string, options = {}) => {
    const $newNode = options.xmlns ? document.createElementNS(options.xmlns, tagName) : document.createElement(tagName)

    initElement($newNode)

    if ($node.namespaceURI === $newNode.namespaceURI) {
        while ($node.childNodes.length > 0) {
            $newNode.appendChild($node.childNodes[0])
        }
    }

    return $newNode
}

/**
 * @param $node
 * @param vRNode
 * @param options
 * @return {HTMLElement}
 */
const patchElement = ($node: HTMLElement, vRNode: VRNode, options = {}) => {
    if ($node instanceof Text) {
        return patch_Text_VRNode($node, vRNode, options)
    }

    options.xmlns = $node.namespaceURI

    if ($node.tagName.toLowerCase() !== vRNode.tagName.toLowerCase()) {
        const $oldNode = $node
        $node = recreateElementByTagName($node, vRNode.tagName, options)

        for (let [k, v] of Object.entries(vRNode.attrs)) {
            if (v != null) {
                $node.setAttribute(k, v)
            }
        }

        for (let [k, v] of Object.entries(vRNode.style)) {
            if (v) {
                $node.style.setProperty(k, v)
                $node.__v.patched_styles.add(k)
            }
        }

        for (const [k, v] of Object.entries(vRNode.events)) {
            $node[`on${k}`] = v
            $node.__v.patched_events.add(k)
        }

        $oldNode.replaceWith($node)
    } else {
        patchAttrs($node, vRNode.attrs, options)
        patchEvents($node, vRNode.events)
        patchStyle($node, vRNode.style)
    }

    if (vRNode.dangerouslySetInnerHTML !== false) {
        patchDangerouslySetInnerHTML($node, vRNode.dangerouslySetInnerHTML)
    } else if (!vRNode.doNotTouchMyChildren) {
        vrdom_patchChildren($node, vRNode, options)
    }

    VApp.plugins.forEach(plugin => plugin.elementDidUpdate($node))

    return $node
}

export default patchElement