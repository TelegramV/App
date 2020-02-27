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

const patchStyle = ($node: HTMLElement, style: VRAttrs) => {
    initElement($node)

    if (typeof $node.style === "object") {
        if (!$node.__v.patched_styles) {
            console.error("BUG: bug")
        }

        for (const [k, v] of Object.entries(style)) {
            if (v === undefined) {
                $node.style.removeProperty(k)
                $node.__v.patched_styles.delete(k)
            } else if ($node.style.getPropertyValue(k) !== v) {
                $node.style.setProperty(k, v)
                $node.__v.patched_styles.add(k)
            }
        }

        for (const k of $node.__v.patched_styles) {
            if (style[k] === undefined) {
                $node.style.removeProperty(k)
                $node.__v.patched_styles.delete(k)
            }
        }
    }
}

export default patchStyle