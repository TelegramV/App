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

import vrdom_mount from "../mount"
import VRNode from "../VRNode"
import patchVRNodeNull from "./patchNull"
import patchNodeText from "./patchText"
import VListVRNode from "../list/VListVRNode"
import patchList from "./patchList"
import vrdom_deleteInner from "../deleteInner"
import patch_Text_VRNode from "./patch_Text_VRNode"
import patch_Node_VRNode from "./patch_Node_VRNode"
import {initElement} from "../render/renderElement"
import cleanElement from "../cleanElement"
import ComponentVRNode from "../component/ComponentVRNode"
import patchComponentVRNode from "./patchAbstractComponentNRNode"
import {__component_unmount} from "../component/__component_unmount"

/**
 * Patches VRNode to Real DOM Element
 *
 * @param $node
 * @param vRNode
 * @param options
 */
const vrdom_patch = ($node, vRNode: VRNode | ComponentVRNode, options = {}): Node => {
    if ($node === undefined) {
        console.error("BUG: `undefined` was passed as $node ")
        return $node
    }

    initElement($node)

    if (vRNode instanceof VRNode) {
        if ($node instanceof Text) {
            return patch_Text_VRNode($node, vRNode)
        }

        return patch_Node_VRNode($node, vRNode)

    } else if (vRNode instanceof ComponentVRNode) {
        // console.log("[patch] VComponent")

        return patchComponentVRNode($node, vRNode)

    } else if (vRNode instanceof VListVRNode) {
        // console.log("[patch] List")

        return patchList($node, vRNode)

    } else if (vRNode === undefined) {
        // console.log("[patch] undefined")

        return patchVRNodeNull($node)

    } else if (vRNode === null) {
        // console.log("[patch] null")

        return patchVRNodeNull($node)

    } else if (!vRNode) {
        // console.log("[patch] false")

        return patchVRNodeNull($node)

    } else {
        // console.log("[patch] unexpected", $node, vRNode)

        if ($node.__v && $node.__v.component) {
            __component_unmount($node.__v.component)
        }

        if ($node instanceof Text) {
            return patchNodeText($node, vRNode)
        }

        vrdom_deleteInner($node)
        cleanElement($node, true)

        return vrdom_mount(vRNode, $node)

    }
}

export default vrdom_patch