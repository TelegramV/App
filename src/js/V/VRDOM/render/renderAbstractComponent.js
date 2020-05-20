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

import vrdom_render from "./render"
import {initElement} from "./renderElement"
import VApp from "../../vapp"
import AbstractComponentVRNode from "../component/AbstractComponentVRNode"
import {__component_init_wip} from "../component/__component_init"
import __component_render_wip from "../component/__component_render"

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

    __component_init_wip(componentInstance)

    return componentInstance
}

/**
 * @param componentNode
 * @param $node
 */
function vrdom_renderAbstractComponentVNode(componentNode, $node: HTMLElement = undefined) {
    const componentInstance = vrdom_instantiateAbstractComponentVNode(componentNode)

    if (!$node) {
        const renderedVRNode = __component_render_wip(componentInstance)

        if (renderedVRNode instanceof AbstractComponentVRNode) {
            throw new Error("Components on top level are forbidden.")
        }

        $node = vrdom_render(renderedVRNode)
    }

    initElement($node)
    $node.__v.component = componentInstance
    componentInstance.$el = $node

    return $node
}


export default vrdom_renderAbstractComponentVNode