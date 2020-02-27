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

import vrdom_render from "./render/render"
import type VRNode from "./VRNode"
import type {VRenderProps} from "./types/types"
import VComponent from "./component/VComponent"
import VF from "../VFramework"

export function vrdom_resolveMount($mounted: Element) {
    if ($mounted.__v) {
        if ($mounted.__v.component) {
            const component = $mounted.__v.component

            if (component instanceof VComponent) {
                component.__mount.call(component, $mounted)
            } else {
                console.error("component was not found. it means that there is a potential bug in the vrdom")
            }
        } else if ($mounted.__v.ref && !$mounted.__v.ref.__component_ref) {
            $mounted.__v.ref.$el = $mounted
        } else if ($mounted.__list) {
            $mounted.__v.list.__mount($mounted)
        }
    }

    if ($mounted instanceof Text) {
        VF.plugins.forEach(plugin => plugin.textDidMount($mounted))
    } else {
        VF.plugins.forEach(plugin => plugin.elementDidMount($mounted))
    }
}

/**
 * Mounts VRNode to Real DOM Element
 *
 * @param node
 * @param $el
 * @param props
 */
function vrdom_mount(node: VRNode, $el: Element | Node | Text, props?: VRenderProps): Element | Node | Text {
    const $mounted = vrdom_realMount(vrdom_render(node, props), $el)

    vrdom_resolveMount($mounted)

    return $mounted
}

export function vrdom_realMount($el: Element | Node | Text, $target: Element | Node | Text): Element {
    if (typeof $target === "string") {
        $target = document.querySelector($target)
    }

    $target.replaceWith($el)

    return $el
}

export default vrdom_mount