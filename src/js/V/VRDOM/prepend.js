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
function vrdom_prepend(node: VRNode, $el: Element, props?: VRenderProps): Element | HTMLElement {
    const $node = vrdom_render(node, props)

    $el.prepend($node)

    vrdom_resolveMount($node)

    return $node
}

/**
 * Prepends VRNode to Real DOM Element children
 *
 * @param nodes
 * @param $el
 * @param props
 */
export function vrdom_prependMany(nodes: VRNode, $el: Element, props?: VRenderProps): Element | HTMLElement {
    return nodes.map(node => {
        const $node = vrdom_render(node, props)

        $el.prepend($node)

        vrdom_resolveMount($node)

        return $node
    })
}

/**
 * Prepends VRNode to Real DOM Element children
 *
 * @param $nodes
 * @param $el
 * @param props
 */
export function vrdom_prependRealMany($nodes: VRNode, $el: Element, props?: VRenderProps): Element | HTMLElement {
    return $nodes.map($node => {
        $el.prepend($node)

        vrdom_resolveMount($node)

        return $node
    })
}

export default vrdom_prepend
