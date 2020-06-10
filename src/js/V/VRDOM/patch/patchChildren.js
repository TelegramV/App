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

import vrdom_delete from "../delete"
import VRNode from "../VRNode"
import vrdom_append from "../append"
import vrdom_patch from "./patch"

/**
 * @param {Element} $node
 * @param {Array<VRNode | any>} vRNode
 * @param options
 */
const vrdom_patchChildren = ($node: Element, vRNode: VRNode, options = {}) => {
    const $children = $node.childNodes
    const children = vRNode.children

    $children.forEach(($oldChild, i) => {
        if (options.touchAll || $oldChild.__v || $oldChild.nodeType === Node.TEXT_NODE || children[i]) { // may be bugs, pls report(
            vrdom_patch($oldChild, children[i], options)
        }
    })

    if (children.length > $children.length) {
        for (let i = $children.length; i < children.length; i++) {
            vrdom_append(children[i], $node, {$parent: $node}, options)
        }
    } else if (children.length < $children.length) {
        Array.from($children.values()).slice(children.length).forEach(($node: Node) => {
            if (options.touchAll || $node.__v || $node.nodeType === Node.TEXT_NODE) {
                vrdom_delete($node)
            }
        })
    }
}

export default vrdom_patchChildren