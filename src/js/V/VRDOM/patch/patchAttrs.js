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

import type {VRAttrs} from "../types/types"
import {initElement} from "../render/renderElement"

const ignoringAttributes = new Set([
    "style",
    // "class"
])

const patchAttrs = ($el: Element, newAttrs: VRAttrs, options = {}) => {
    if ($el.nodeType !== Node.TEXT_NODE) {
        initElement($el)

        if (options.xmlns) {
            for (const [k, v] of Object.entries(newAttrs)) {
                if (ignoringAttributes.has(k)) {
                    continue
                }

                if (v == null) {
                    $el.removeAttributeNS(null, k)
                } else if ($el.getAttribute(k) !== v) {
                    $el.setAttributeNS(null, k, String(v))
                }
            }

            for (const name of $el.getAttributeNames()) {
                if (ignoringAttributes.has(name)) {
                    continue
                }

                if (newAttrs[name] == null) {
                    $el.removeAttributeNS(null, name)
                }
            }
        } else {
            for (const [k, v] of Object.entries(newAttrs)) {
                if (ignoringAttributes.has(k)) {
                    continue
                }

                if (v == null) {
                    $el.removeAttribute(k)
                } else if ($el.getAttribute(k) !== v) {
                    $el.setAttribute(k, String(v))
                }
            }

            for (const name of $el.getAttributeNames()) {
                if (ignoringAttributes.has(name)) {
                    continue
                }

                if (newAttrs[name] == null) {
                    $el.removeAttribute(name)
                }
            }
        }
    }
}

export default patchAttrs