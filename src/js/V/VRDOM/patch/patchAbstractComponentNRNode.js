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

import patch_Text_VRNode from "./patch_Text_VRNode"
import {initElement} from "../render/renderElement"
import ComponentVRNode from "../component/ComponentVRNode"
import {__component_update_props} from "../component/__component_update"
import __component_unmount from "../component/__component_unmount"
import __component_mount from "../component/__component_mount"
import vrdom_renderAbstractComponentVNode from "../render/renderAbstractComponent"

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
            $node = vrdom_renderAbstractComponentVNode(vRNode, $node)
            __component_mount($node.__v.component, $node)
            $node.__v.component.forceUpdate.call($node.__v.component)
        }
    } else {
        $node = vrdom_renderAbstractComponentVNode(vRNode, $node)
        __component_mount($node.__v.component, $node)
        $node.__v.component.forceUpdate.call($node.__v.component)
    }

    return $node
}

export default patchAbstractComponentVRNode