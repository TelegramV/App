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
import type {VRenderProps} from "../types/types"
import renderElement from "./renderElement"
import renderText from "./renderText"
import vrdom_renderVComponentVNode from "./renderVComponent"
import VComponentVRNode from "../component/VComponentVRNode"
import VListVRNode from "../list/VListVRNode"
import vrdom_renderVListVRNode from "./renderVList"

/**
 * Creates Real DOM Element from VRNode
 *
 * @param node
 * @param props
 */
function vrdom_render(node: VRNode, props: VRenderProps = {}): HTMLElement | Element | Node | Text {

    if (node instanceof VComponentVRNode) {
        return vrdom_renderVComponentVNode(node)
    } else if (node instanceof VListVRNode && props.$parent) {
        return vrdom_renderVListVRNode(node, props)
    }

    if (node instanceof VRNode) {
        return renderElement(node, props)
    } else if (!node) {
        return renderText(node)
    } else {
        if (typeof node === "object") {
            return renderText(JSON.stringify(node))
        } else {
            return renderText(node)
        }
    }
}

export default vrdom_render