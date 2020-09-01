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

import vrdom_render from "../render/render"
import {initElement} from "../render/renderElement"
import VApp from "../../vapp"

const patchList = ($node, listNode) => {
    initElement($node)

    if ($node.__v.component) {
        $node.__v.component.__unmount()
    }

    if ($node.__v.list) {
        if ($node.__v.list.constructor === listNode.tag) {
            $node.__v.list.__update({
                list: listNode.list,
                template: listNode.template,
            })
        } else {
            console.error("BUG: unimplemented thing [patchList -> vListVRNode]", $node, listNode)
        }

        return $node
    } else {
        const list = new (listNode.tag)({list: listNode.list, template: listNode.template})
        list.identifier = VApp.uniqueComponentId()

        list.$el = vrdom_render(listNode.wrapper)
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