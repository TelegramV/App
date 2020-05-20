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

import {__component_unmount_wip} from "./component/__component_unmount"

/**
 * @param {HTMLElement|Text} $node
 * @param unmount unmount component/list/ref if exist
 * @return {HTMLElement|Text}
 */
const cleanElement = ($node: HTMLElement, unmount: boolean = false) => {
    if ($node.__v) {
        if (unmount) {
            if ($node.__v.component) {
                __component_unmount_wip($node.__v.component)
            }

            if ($node.__v.list) {
                $node.__v.list.__unmount()
            }

            if ($node.__v.ref) {
                $node.__v.ref.__unmount()
            }
        }

        $node.__v.component = null
        $node.__v.ref = null
        $node.__v.patched_styles.forEach(k => $node.style.removeProperty(k))
        $node.__v.patched_events.forEach(k => $node[`on${k}`] = null)
        $node.__v.patched_styles = null
        $node.__v.patched_events = null
        $node.__v = null
    }

    return $node
}

export default cleanElement