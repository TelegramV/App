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

import type {Ref, VRAttrs, VREvents, VRNodeProps, VRTagName} from "./types/types"
import List from "./list/List"

class VRNode {

    tagName: VRTagName

    attrs: VRAttrs = {}
    events: VREvents = {}
    children: Array<VRNode> = []
    style: Object
    ref: Ref

    dangerouslySetInnerHTML: any | boolean = false
    component = undefined
    list: List = undefined

    constructor(tagName: VRTagName, props: VRNodeProps) {
        this.tagName = tagName

        this.attrs = props.attrs || {}
        this.events = props.events || {}
        this.children = props.children || []
        this.style = props.style || {}
        this.ref = props.ref

        this.dangerouslySetInnerHTML = props.dangerouslySetInnerHTML || false
        this.component = props.component
        this.list = props.list
    }
}

export default VRNode