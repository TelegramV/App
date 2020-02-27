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

import VRNode from "./VRNode"
import type {VRenderProps} from "./types/types"
import {vrdom_resolveMount} from "./mount"
import vrdom_render from "./render/render"

/**
 * Appends VRNode to Real DOM Element children
 *
 * @param node
 * @param $parent
 * @param props
 */
const vrdom_append = (node: VRNode, $parent: HTMLElement, props?: VRenderProps) => {
    const $node = vrdom_render(node, props)

    $parent.appendChild($node)
    vrdom_resolveMount($node)

    return $node
}

export default vrdom_append
