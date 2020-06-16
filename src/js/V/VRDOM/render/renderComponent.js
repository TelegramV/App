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

import vrdom_render from "./render"
import {initElement} from "./renderElement"
import VApp from "../../vapp"
import ComponentVRNode from "../component/ComponentVRNode"
import __component_init from "../component/__component_init"
import __component_render from "../component/__component_render"

export function vrdom_instantiateAbstractComponentVNode(componentNode) {
    const componentInstance = new (componentNode.componentClass)({
        props: componentNode.attrs,
        slot: componentNode.slot,
    })

    if (componentNode.ref && componentNode.ref.__component_ref) {
        componentNode.ref.component = componentInstance
    }

    if (componentInstance.identifier) {
        componentInstance.identifier = String(componentInstance.identifier)
    } else if (componentNode.identifier) {
        componentInstance.identifier = String(componentNode.identifier)
    } else {
        componentInstance.identifier = String(VApp.uniqueComponentId())
    }

    __component_init(componentInstance)

    return componentInstance
}

/**
 * @param componentNode
 * @param $node
 */
function vrdom_renderComponentVNode(componentNode, $node: HTMLElement = undefined) {
    const componentInstance = vrdom_instantiateAbstractComponentVNode(componentNode)

    if (!$node) {
        const renderedVRNode = __component_render(componentInstance)

        if (renderedVRNode instanceof ComponentVRNode) {
            throw new Error("Components on top level are forbidden.")
        }

        $node = vrdom_render(renderedVRNode)
    }

    initElement($node)
    $node.__v.component = componentInstance
    componentInstance.$el = $node

    return $node
}


export default vrdom_renderComponentVNode