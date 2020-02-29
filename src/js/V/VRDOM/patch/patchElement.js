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

import patchAttrs from "./patchAttrs"
import patchEvents from "./patchEvents"
import patchStyle from "./patchStyle"
import patchDangerouslySetInnerHTML from "./patchDangerouslySetInnerHTML"
import vrdom_patchChildren from "./patchChildren"
import VRNode from "../VRNode"
import patch_Text_VRNode from "./patch_Text_VRNode"
import {initElement} from "../render/renderElement"
import VApp from "../../../vapp"

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
    } else {
        vrdom_patchChildren($node, vRNode)
    }

    VApp.plugins.forEach(plugin => plugin.elementDidUpdate($node))

    return $node
}

export default patchElement