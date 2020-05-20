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

import VRNode from "../VRNode"
import patchElement from "./patchElement"
import patch_Text_VRNode from "./patch_Text_VRNode"
import {initElement} from "../render/renderElement"
import {__component_unmount_wip} from "../component/__component_unmount"

const patch_Node_VRNode = ($node: HTMLElement, vRNode: VRNode): HTMLElement => {
    if ($node instanceof Text) {
        return patch_Text_VRNode($node, vRNode)
    }

    initElement($node)

    if ($node.__v.component) {
        if ($node.__v.component !== vRNode.component) {
            __component_unmount_wip($node.__v.component)
        }
    } else if (vRNode.component) {
        console.error("BUG: unimplemented thing [vRNode.component]", $node, vRNode)
    }

    if ($node.__v.list) {
        $node.__v.list.__unmount()
    } else if (vRNode.list) {
        console.error("BUG: unimplemented thing [vRNode.list]")
    }

    $node = patchElement($node, vRNode)

    return $node
}

export default patch_Node_VRNode