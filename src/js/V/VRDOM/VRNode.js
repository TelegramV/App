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
    doNotTouchMyChildren: any | boolean = false
    component = undefined
    list: List = undefined

    key: string

    constructor(tagName: VRTagName, props: VRNodeProps) {
        this.tagName = tagName

        this.attrs = props.attrs || {}
        this.events = props.events || {}
        this.children = props.children || []
        this.style = props.style || {}
        this.ref = props.ref
        this.key = props.key

        this.dangerouslySetInnerHTML = props.dangerouslySetInnerHTML || false
        this.doNotTouchMyChildren = props.doNotTouchMyChildren || false
        this.component = props.component
        this.list = props.list
        this.shouldRecreate = props.attrs.$recreate ?? false

        delete props.attrs.$recreate
    }
}

export default VRNode