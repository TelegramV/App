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

const patchClass = ($el: HTMLElement, className: any) => {
    if (!className) {
        $el.attributes.removeNamedItem("class")
        return
    }

    if (typeof className === "object") {
        for (let [classK, classV] of Object.entries(className)) {
            $el.classList.toggle(classK, classV)
        }
        className = Object.keys(className)
    } else if (Array.isArray(className)) {
        $el.classList.add(...className)
    } else {
        $el.classList.add(className)
        className = className.split(" ")
    }

    for (const oldClassName of $el.classList.values()) {
        if (!className[oldClassName]) {
            $el.classList.remove(oldClassName)
        }
    }
}

export default patchClass