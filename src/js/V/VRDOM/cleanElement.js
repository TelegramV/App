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

import {__component_unmount} from "./component/__component_unmount"

/**
 * @param {HTMLElement|Text} $node
 * @param unmount unmount component/list/ref if exist
 * @return {HTMLElement|Text}
 */
const cleanElement = ($node: HTMLElement, unmount: boolean = false) => {
    if ($node.__v) {
        if (unmount) {
            if ($node.__v.component) {
                __component_unmount($node.__v.component)
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