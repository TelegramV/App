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
import patchEvents from "./patchEvents"
import patchStyle from "./patchStyle"
import patchDangerouslySetInnerHTML from "./patchDangerouslySetInnerHTML"
import vrdom_patchChildren from "./patchChildren"
import VRNode from "../VRNode"
import patch_Text_VRNode from "./patch_Text_VRNode"
import {initElement} from "../render/renderElement"
import VApp from "../../vapp"
import vrdom_mount from "../mount"

const recreateElementByTagName = ($node: HTMLElement, tagName: string) => {
    const $newNode = document.createElement(tagName)

    initElement($newNode)

    while ($node.childNodes.length > 0) {
        $newNode.appendChild($node.childNodes[0])
    }

    return $newNode
}


const ignore = new Set([
    "svg"
])

/**
 * @param $node
 * @param vRNode
 * @return {HTMLElement}
 */
const patchElement = ($node: HTMLElement, vRNode: VRNode) => {
    if ($node instanceof Text) {
        return patch_Text_VRNode($node, vRNode)
    }

    if (vRNode.tagName.toLowerCase() === "svg") {
        return vrdom_mount(vRNode, $node)
    }

    if ($node.tagName.toLowerCase() !== vRNode.tagName.toLowerCase()) {
        const $oldNode = $node
        $node = recreateElementByTagName($node, vRNode.tagName)
        $oldNode.replaceWith($node)
    }

    patchAttrs($node, vRNode.attrs)
    patchEvents($node, vRNode.events)
    patchStyle($node, vRNode.style)

    if (vRNode.dangerouslySetInnerHTML !== false) {
        patchDangerouslySetInnerHTML($node, vRNode.dangerouslySetInnerHTML)
    } else if (!vRNode.doNotTouchMyChildren) {
        vrdom_patchChildren($node, vRNode)
    }

    VApp.plugins.forEach(plugin => plugin.elementDidUpdate($node))

    return $node
}

export default patchElement