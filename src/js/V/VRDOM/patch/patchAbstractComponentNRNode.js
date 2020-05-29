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

import patch_Text_VRNode from "./patch_Text_VRNode"
import {initElement} from "../render/renderElement"
import ComponentVRNode from "../component/ComponentVRNode"
import {__component_update_props} from "../component/__component_update"
import __component_unmount from "../component/__component_unmount"
import __component_mount from "../component/__component_mount"
import vrdom_renderComponentVNode from "../render/renderComponent"

function patchAbstractComponentVRNode($node: Element, vRNode: ComponentVRNode) {

    if ($node instanceof Text) {
        return patch_Text_VRNode($node, vRNode)
    }

    if (!(vRNode instanceof ComponentVRNode)) {
        console.error("BUG: BUG")
    }

    initElement($node)

    if ($node.__v && $node.__v.component) {
        if ($node.__v.component.constructor === vRNode.componentClass) {
            // console.warn("updating", $node.__v.component)
            __component_update_props($node.__v.component, vRNode.attrs)
        } else {
            __component_unmount($node.__v.component)
            $node = vrdom_renderComponentVNode(vRNode, $node)
            __component_mount($node.__v.component, $node)
            $node.__v.component.forceUpdate.call($node.__v.component)
        }
    } else {
        $node = vrdom_renderComponentVNode(vRNode, $node)
        __component_mount($node.__v.component, $node)
        $node.__v.component.forceUpdate.call($node.__v.component)
    }

    return $node
}

export default patchAbstractComponentVRNode