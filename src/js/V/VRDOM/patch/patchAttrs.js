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

import type {VRAttrs} from "../types/types"
import {initElement} from "../render/renderElement"

const ignoringAttributes = new Set([
    "style",
    // "class"
])

const patchAttrs = ($el: Element, newAttrs: VRAttrs) => {
    if ($el.nodeType !== Node.TEXT_NODE) {
        initElement($el)

        for (const [k, v] of Object.entries(newAttrs)) {
            if (ignoringAttributes.has(k)) {
                continue
            }

            if (v === undefined) {
                $el.removeAttribute(k)
            } else if ($el.getAttribute(k) !== v) {
                $el.setAttribute(k, String(v))
            }
        }

        for (const name of $el.getAttributeNames()) {
            if (ignoringAttributes.has(name)) {
                continue
            }

            if (newAttrs[name] === undefined) {
                $el.removeAttribute(name)
            }
        }
    }
}

export default patchAttrs