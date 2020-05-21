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

import type {VComponentVRNodeProps, VRAttrs, VRSlot} from "../types/types"
import VComponent from "./VComponent"

class ComponentVRNode {
    componentClass: Class<VComponent>

    attrs: VRAttrs = {}
    slot: VRSlot
    ref: Object

    identifier: string | void

    constructor(componentClass: Class<VComponent>, props: VComponentVRNodeProps, slot?: VRSlot) {
        this.componentClass = componentClass
        this.attrs = props.attrs
        this.slot = slot
        this.ref = props.ref
        this.identifier = props.identifier
    }
}

export default ComponentVRNode