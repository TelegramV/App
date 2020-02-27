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

import VListVRNode from "../list/VListVRNode"
import VF from "../../VFramework"
import vrdom_render from "../render/render"
import {initElement} from "../render/renderElement"

const patchList = ($node, node: VListVRNode) => {
    initElement($node)

    if ($node.__v.component) {
        $node.__v.component.__unmount()
    }

    if ($node.__v.list) {
        if ($node.__v.list.constructor === node.tag) {
            $node.__v.list.__update({
                list: node.list,
                template: node.template,
            })
        } else {
            console.error("BUG: unimplemented thing [patchList -> vListVRNode]", $node, node)
        }

        return $node
    } else {
        const list = new (node.tag)({list: node.list, template: node.template})
        list.identifier = VF.uniqueComponentId()

        list.$el = vrdom_render(node.wrapper)
        list.$el.__v.list = list

        while ($node.childNodes.length > 0) {
            list.$el.appendChild($node.childNodes[0])
        }

        list.__refresh()
        $node.replaceWith(list.$el)

        return list.$el
    }
}

export default patchList