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

import VRNode from "./VRNode"
import type {VRenderProps} from "./types/types"
import {vrdom_resolveMount} from "./mount"
import vrdom_render from "./render/render"

/**
 * @param node
 * @param $parent
 * @param options
 */
const vrdom_append = (node: VRNode, $parent: HTMLElement, options?: VRenderProps) => {
    const $node = vrdom_render(node, options)

    $parent.appendChild($node)

    vrdom_resolveMount($node)

    return $node
}

/**
 * @param $nodes
 * @param $parent
 */
export function vrdom_appendRealMany($nodes: Node[], $parent: HTMLElement) {
    $parent.append(...$nodes);

    $nodes.forEach($node => {
        vrdom_resolveMount($node)
    });

    return $nodes;
}

export default vrdom_append
