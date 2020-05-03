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

import vrdom_delete from "../delete"
import VRNode from "../VRNode"
import vrdom_append from "../append"
import vrdom_patch from "./patch"

/**
 * @param {Element} $node
 * @param {Array<VRNode | any>} vRNode
 */
const vrdom_patchChildren = ($node: Element, vRNode: VRNode) => {
    const $children = $node.childNodes
    const children = vRNode.children

    $children.forEach(($oldChild, i) => {
        vrdom_patch($oldChild, children[i])
    })

    if (children.length > $children.length) {
        for (let i = $children.length; i < children.length; i++) {
            vrdom_append(children[i], $node, {$parent: $node})
        }
    } else if (children.length < $children.length) {
        Array.from($children.values()).slice(children.length).forEach(($node: Node) => {
            if ($node.attributes && !$node.attributes["class"] !== "ripple") {
                vrdom_delete($node)
            } else {
                vrdom_delete($node)
            }
        })
    }
}

export default vrdom_patchChildren