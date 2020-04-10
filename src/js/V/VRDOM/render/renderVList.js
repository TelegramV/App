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
import vrdom_append from "../append"
import type {VRenderProps} from "../types/types"
import vrdom_render from "./render"
import VApp from "../../vapp"

function vrdom_renderVListVRNode(node: VListVRNode, props: VRenderProps) {
    const listInstance = new (node.tag)({list: node.list, template: node.template})

    listInstance.identifier = String(++(VApp.latestInstantiatedComponent))
    listInstance.$el = vrdom_render(node.wrapper)
    listInstance.$el.__v.list = listInstance

    const items = listInstance.render()

    items.forEach(value => {
        listInstance.childNodes.push(
            vrdom_append(value, listInstance.$el, {xmlns: props.xmlns})
        )
    })

    return listInstance.$el
}

export default vrdom_renderVListVRNode