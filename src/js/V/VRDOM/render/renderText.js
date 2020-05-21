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

import VApp from "../../vapp"

const renderText = text => {
    if (VApp.interceptor) {
        const intercepted = VApp.interceptor.textCreateIntercept(text)

        if (intercepted === undefined) {
            return document.createTextNode(text)
        } else if (intercepted instanceof Node) {
            return intercepted
        } else if (intercepted instanceof NodeList || Array.isArray(intercepted) || intercepted[Symbol.iterator]) {
            return intercepted
        }
    }

    return document.createTextNode(text)
}

export default renderText