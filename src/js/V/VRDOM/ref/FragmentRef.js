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

import type {VRAttrs, VRSlot} from "../types/types"
import VRDOM from "../VRDOM"
import VApp from "../../vapp"

// const __fragment_ref_update = (ref: FragmentRef, props = {}) => {
//     if (ref.$el) {
//         Object.assign(ref.props, props)
//
//         return ref.$el = VRDOM.patch(ref.$el, ref.fragment({...ref.props, slot: ref.slot}))
//     } else {
//         console.warn("$el not found", ref)
//     }
// }

const __fragment_ref_unmount = (ref: FragmentRef) => {
    ref.fragment = undefined
    ref.slot = undefined
    ref.props = undefined
    ref.$el && (ref.$el.__ref = undefined)
    ref.$el = undefined
}

class FragmentRef {
    __fragment_ref = true
    identifier: number

    $el: HTMLElement
    fragment: Function
    props: VRAttrs
    slot: VRSlot

    constructor() {
        this.identifier = ++(VApp.latestInstantiatedRef)
    }

    unmount = () => {
        return __fragment_ref_unmount(this)
    }
}

export default FragmentRef