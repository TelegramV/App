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

import render from "../xpatch/xrender"

/**
 * Creates Real DOM Element from VRNode
 *
 * @param vNode
 * @param options
 */
function vrdom_render(vNode, options): HTMLElement | Element | Node | Text {
    const shouldFire = options.componentCallbacks;
    if (!options.componentCallbacks) {
        options.componentCallbacks = []
    }
    const $el = render(vNode, options);
    if (!shouldFire) {
        options.componentCallbacks.forEach(fn => fn())
    }
    return $el;
    // try {
    //     if (node instanceof ComponentVRNode) {
    //         return vrdom_renderComponentVNode(node)
    //     } else if (node instanceof VListVRNode && props.$parent) {
    //         return vrdom_renderVListVRNode(node, props)
    //     }
    //
    //     if (node instanceof VRNode) {
    //         return renderElement(node, props)
    //     } else if (!node) {
    //         return renderText(node)
    //     } else {
    //         if (typeof node === "object") {
    //             return renderText(JSON.stringify(node))
    //         } else {
    //             return renderText(node)
    //         }
    //     }
    // } catch (e) {
    //     console.error(e)
    //     return document.createTextNode(e.toString())
    // }
}

export default vrdom_render