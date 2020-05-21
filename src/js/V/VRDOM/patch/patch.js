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

import vrdom_mount from "../mount"
import VRNode from "../VRNode"
import patchVRNodeUndefined from "./patchVRNodeUndefined"
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

        return patchVRNodeUndefined($node)

    } else if (vRNode === null) {
        // console.log("[patch] null")

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