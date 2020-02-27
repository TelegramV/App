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

import type {VRAttrs, VRSlot} from "../types/types"
import VRDOM from "../VRDOM"
import VF from "../../VFramework"

const __fragment_ref_update = (ref: FragmentRef, props = {}) => {
    if (ref.$el) {
        Object.assign(ref.props, props)

        return ref.$el = VRDOM.patch(ref.$el, ref.fragment({...ref.props, slot: ref.slot}))
    } else {
        console.warn("$el not found", ref)
    }
}

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
        this.identifier = ++(VF.latestInstantiatedRef)
    }

    patch = (props) => {
        return this.update(props)
    }

    update = (props) => {
        return __fragment_ref_update(this, props)
    }

    unmount = () => {
        return __fragment_ref_unmount(this)
    }
}

export default FragmentRef