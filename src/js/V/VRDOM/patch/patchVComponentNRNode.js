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

import VComponentVRNode from "../component/VComponentVRNode"
import vrdom_renderVComponentVNode from "../render/renderVComponent"
import patch_Text_VRNode from "./patch_Text_VRNode"
import {initElement} from "../render/renderElement"

const patchVComponentVRNode = ($node: Element, vRNode: VComponentVRNode) => {

    if ($node instanceof Text) {
        return patch_Text_VRNode($node, vRNode)
    }

    if (!(vRNode instanceof VComponentVRNode)) {
        console.error("BUG: BUG")
    }

    initElement($node)

    if ($node.__v && $node.__v.component) {
        if ($node.__v.component.constructor === vRNode.component) {
            // console.warn("updating", $node.__v.component)
            $node.__v.component.__update.call($node.__v.component, {
                nextProps: vRNode.attrs,
            })
        } else {
            $node.__v.component.__unmount.call($node.__v.component)
            $node = vrdom_renderVComponentVNode(vRNode, $node)
            $node.__v.component.__mount.call($node.__v.component, $node)
            $node.__v.component.forceUpdate.call($node.__v.component)
        }
    } else {
        $node = vrdom_renderVComponentVNode(vRNode, $node)
        $node.__v.component.__mount.call($node.__v.component, $node)
        $node.__v.component.forceUpdate.call($node.__v.component)
    }

    return $node
}

export default patchVComponentVRNode