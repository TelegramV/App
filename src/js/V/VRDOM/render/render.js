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

import VRNode from "../VRNode"
import type {VRenderProps} from "../types/types"
import renderElement from "./renderElement"
import renderText from "./renderText"
import VListVRNode from "../list/VListVRNode"
import vrdom_renderVListVRNode from "./renderVList"
import ComponentVRNode from "../component/ComponentVRNode"
import vrdom_renderAbstractComponentVNode from "./renderAbstractComponent"

/**
 * Creates Real DOM Element from VRNode
 *
 * @param node
 * @param props
 */
function vrdom_render(node: VRNode, props: VRenderProps = {}): HTMLElement | Element | Node | Text {
    try {
        if (node instanceof ComponentVRNode) {
            return vrdom_renderAbstractComponentVNode(node)
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
    } catch (e) {
        console.error(e)
        return document.createTextNode(e.toString())
    }
}

export default vrdom_render