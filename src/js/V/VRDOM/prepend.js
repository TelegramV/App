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

import type VRNode from "./VRNode"
import type {VRenderProps} from "./types/types"
import vrdom_render from "./render/render"
import {vrdom_resolveMount} from "./mount"

/**
 * Prepends VRNode to Real DOM Element children
 *
 * @param node
 * @param $el
 * @param props
 */
function vrdom_prepend(node: VRNode, $el: Element, props?: VRenderProps): Element {
    const $node = vrdom_render(node, props)

    $el.prepend($node)

    vrdom_resolveMount($node)

    return $node
}

export default vrdom_prepend
