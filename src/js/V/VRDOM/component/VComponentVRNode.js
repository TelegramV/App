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

import type {VComponentVRNodeProps, VRAttrs, VRSlot} from "../types/types"
import VComponent from "./VComponent"

class VComponentVRNode {

    component: Class<VComponent>

    attrs: VRAttrs = {}
    slot: VRSlot
    ref: Object

    identifier: string | void

    constructor(component: Class<VComponent>, props: VComponentVRNodeProps, slot?: VRSlot) {
        this.component = component
        this.attrs = props.attrs
        this.slot = slot
        this.ref = props.ref
        this.identifier = props.identifier
    }
}

export default VComponentVRNode