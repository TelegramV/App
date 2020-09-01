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

import VRNode from "../VRNode"
import type {BusEvent} from "../../../Api/EventBus/EventBus"
import {EventBus} from "../../../Api/EventBus/EventBus"
import {ReactiveObject} from "../../Reactive/ReactiveObject"
import VComponent from "../component/VComponent"
import ElementRef from "../ref/ElementRef"
import ComponentRef from "../ref/ComponentRef"
import FragmentRef from "../ref/FragmentRef"
import VCollection from "../list/VCollection"

export type VRTagName = string | number | function | Class<VComponent>

export type VRAttrs = {
    [string]: any
}

export type VListVRNodeAttrs = {
    tag: function,
    list: VCollection,
    template: function,
    wrapper: VRNode
}

export type VRStyle = {
    [string]: string
}

export type VREvents = {
    [string]: (event: Event) => void
}

export type VRenderProps = {
    xmlns?: string | void;
    $parent?: HTMLElement;
    intercepted: boolean;
}

export type Ref = ElementRef | FragmentRef | ComponentRef

export type VRNodeProps = {
    ref: Ref,
    attrs: VRAttrs,
    events: VREvents,
    dangerouslySetInnerHTML: any | boolean,
    children: Array<VRNodeProps | VRNode>,
    component?: VComponent,
    style: any,
}

export type VRSlot = VRNode | void

export type VComponentVRNodeProps = {
    attrs: VRAttrs,
    identifier: string | void
}

export type VComponentMeta = {
    inited: boolean,
    mounted: boolean,
    destroyed: boolean,
    isUpdatingItSelf: boolean,
    reactiveObjectContexts: Map<ReactiveObject, Map<string, BusEvent => any>>,
    appEventContexts: Map<EventBus, Map<string, BusEvent => any>>,
    intervals: Set<number>,
    timeouts: Set<number>,
}

export type VComponentProps = {
    displayName?: string,
    props?: VRAttrs,
    slot?: VRSlot,
    v?: any,
    identifier?: string,
}

export type ComponentState = {
    [string]: any
}