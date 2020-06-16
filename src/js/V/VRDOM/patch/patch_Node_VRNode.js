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
import patchElement from "./patchElement"
import patch_Text_VRNode from "./patch_Text_VRNode"
import {initElement} from "../render/renderElement"
import {__component_unmount} from "../component/__component_unmount"

const patch_Node_VRNode = ($node: HTMLElement, vRNode: VRNode, options = {}): HTMLElement => {
    if ($node instanceof Text) {
        return patch_Text_VRNode($node, vRNode, options)
    }

    initElement($node)

    if ($node.__v.component) {
        if ($node.__v.component !== vRNode.component) {
            __component_unmount($node.__v.component)
        }
    }
    // else if (vRNode.component) {
    //     console.error("BUG: unimplemented thing [vRNode.component]", $node, vRNode)
    // }

    if ($node.__v.list) {
        $node.__v.list.__unmount()
    } else if (vRNode.list) {
        console.error("BUG: unimplemented thing [vRNode.list]")
    }

    $node = patchElement($node, vRNode, options)

    return $node
}

export default patch_Node_VRNode