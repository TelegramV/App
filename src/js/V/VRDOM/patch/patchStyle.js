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

import type {VRAttrs} from "../types/types"
import {initElement} from "../render/renderElement"

const patchStyle = ($node: HTMLElement, style: VRAttrs) => {
    initElement($node)

    if (typeof $node.style === "object") {
        if (!$node.__v.patched_styles) {
            console.error("BUG: bug")
        }

        for (const [k, v] of Object.entries(style)) {
            if (!v && v !== 0) {
                $node.style.removeProperty(k)
                $node.__v.patched_styles.delete(k)
            } else if ($node.style.getPropertyValue(k) !== v) {
                $node.style.setProperty(k, v)
                $node.__v.patched_styles.add(k)
            }
        }

        for (const k of $node.__v.patched_styles) {
            if (!style[k] && style[k] !== 0) {
                $node.style.removeProperty(k)
                $node.__v.patched_styles.delete(k)
            }
        }
    } else {
        $node.__v.patched_styles.clear()
        $node.setAttribute("style", style)
    }
}

export default patchStyle