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

import vrdom_render from "./render/render"
import type VRNode from "./VRNode"
import type {VRenderProps} from "./types/types"
import VApp from "../vapp"
import __component_mount from "./component/__component_mount"
import cleanDOMElement from "./cleanDOMElement"

export function vrdom_resolveMount($mounted: Element) {
    if ($mounted.__v) {
        if ($mounted.__v.component) {
            __component_mount($mounted.__v.component, $mounted)
        }

        if ($mounted.__v.ref && !$mounted.__v.ref.__component_ref) {
            $mounted.__v.ref.$el = $mounted
        }

        if ($mounted.__list) {
            $mounted.__v.list.__mount($mounted)
        }
    }

    if ($mounted instanceof Text) {
        VApp.plugins.forEach(plugin => plugin.textDidMount($mounted))
    } else {
        VApp.plugins.forEach(plugin => plugin.elementDidMount($mounted))
    }
}

/**
 * Mounts VRNode to Real DOM Element
 *
 * @param node
 * @param $el
 * @param options
 */
function vrdom_mount(node: VRNode, $el: Element | Node | Text, options?: VRenderProps): Element | Node | Text {
    cleanDOMElement($el, true);

    const $mounted = vrdom_realMount(vrdom_render(node, options), $el)

    vrdom_resolveMount($mounted)

    return $mounted
}

export function vrdom_realMount($el: Element | Node | Text, $target: Element | Node | Text): Element {
    $target.replaceWith($el)

    return $el
}

export default vrdom_mount