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
