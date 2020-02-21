/*
 * Copyright 2020 Telegram V.
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

import vrdom_mount from "../mount"
import patchAttrs from "./patchAttrs"
import patchEvents from "./patchEvents"
import patchDangerouslySetInnerHTML from "./patchDangerouslySetInnerHTML"
import VRNode from "../VRNode"
import vrdom_patchChildren from "./vrdom_patchChildren"
import patchVRNodeUndefined from "./patchVRNodeUndefined"
import VComponentVRNode from "../component/VComponentVRNode"
import patchVRNodeNull from "./patchNull"
import patchNodeText from "./patchText"
import patchVComponentVRNode from "./patchVComponentNRNode"
import patchStyle from "./patchStyle"
import VF from "../../VFramework"
import {VListVRNode} from "../list/VListVRNode"
import patchList from "./patchList"
import vrdom_deleteInner from "../deleteInner"

const recreateNodeOnlyTagName = ($node, tagName) => {
    const $newNode = document.createElement(tagName)

    while ($node.childNodes.length > 0) {
        $newNode.appendChild($node.childNodes[0])
    }

    $newNode.__component = $node.__component
    $node.__component = undefined

    return $newNode
}

/**
 * Patches VRNode to Real DOM Element
 *
 * @param $node
 * @param vRNode
 */
const vrdom_patch = ($node, vRNode: VRNode | VComponentVRNode) => {
    if ($node === undefined) {
        console.error("BUG: `undefined` was passed as $node ")
        return $node
    }

    const $oldNode = $node

    if (vRNode instanceof VRNode) {
        if ($node.nodeType === Node.TEXT_NODE) {
            return vrdom_mount(vRNode, $node)
        }

        if ($node.__component) {
            if (!$node.__component.__.isUpdatingItSelf) {
                $node.__component.__unmount()
                $node.__component = undefined
            }
        }

        if ($node.__list) {
            $node.__list.__unmount()
            $node.__list = undefined
        }

        if ($node.tagName.toLowerCase() !== vRNode.tagName) {
            $node = recreateNodeOnlyTagName($node, vRNode.tagName)
        }

        patchAttrs($node, vRNode.attrs)
        // patchClass($node, vRNode.attrs["class"])
        patchEvents($node, vRNode.events)
        patchStyle($node, vRNode.style)

        if (vRNode.dangerouslySetInnerHTML !== false) {
            patchDangerouslySetInnerHTML($node, vRNode.dangerouslySetInnerHTML)
        } else {
            vrdom_patchChildren($node, vRNode)
        }

        if ($oldNode !== $node) {
            $oldNode.__component = undefined
            $oldNode.replaceWith($node)
        }

        VF.plugins.forEach(plugin => plugin.elementPatched($node))

        return $node

    } else if (vRNode instanceof VComponentVRNode) {
        // console.log("[patch] VComponent")

        return patchVComponentVRNode($node, vRNode)

    } else if (vRNode instanceof VListVRNode) {
        // console.log("[patch] List")

        return patchList($node, vRNode)

    } else if (vRNode === undefined) {
        // console.log("[patch] undefined")

        return patchVRNodeUndefined($node)

    } else if (vRNode === null) {
        // console.log("[patch] undefined")

        return patchVRNodeNull($node)

    } else {
        // console.log("[patch] unexpected", $node, vRNode)

        if ($node.__component) {
            $node.__component.__unmount()
        }

        if ($node.nodeType === Node.TEXT_NODE) {
            return patchNodeText($node, vRNode)
        }

        vrdom_deleteInner($node)

        return vrdom_mount(vRNode, $node)

    }
}

export default vrdom_patch