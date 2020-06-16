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

import VComponent from "../component/VComponent"
import VApp from "../../vapp"

class ComponentRef {
    __component_ref = true
    identifier: number

    component: VComponent

    constructor() {
        this.identifier = ++(VApp.latestInstantiatedRef)
    }

    update(props = {}) {
        this.component.updateProps(props);
    }

    unmount() {
        this.component && this.component.__unmount()
        this.component = undefined
    }
}

export default ComponentRef