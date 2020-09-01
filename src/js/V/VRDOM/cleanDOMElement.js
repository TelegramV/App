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

import unmountComponent from "./xpatch/xunmountComponent"

/**
 * @param {HTMLElement|Text} $el
 * @param unmount unmount component/list/ref if exist
 * @return {HTMLElement|Text}
 */
const cleanDOMElement = ($el: HTMLElement, unmount: boolean = false) => {
    if ($el.__v) {
        if (unmount) {
            if ($el.__v.component) {
                unmountComponent($el.__v.component)
            }

            if ($el.__v.ref) {
                $el.__v.ref.__unmount()
            }
        }

        $el.__v.component = null
        $el.__v.ref = null
        // $node.__v.patched_styles.forEach(k => $node.style.removeProperty(k))
        // $node.__v.patched_events.forEach(k => $node[`on${k}`] = null)
        $el.__v.patched_styles = null
        $el.__v.patched_events = null
        $el.__v = null
    }

    return $el
}

export default cleanDOMElement