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

import VRNode from "../VRNode"
import type {BusEvent} from "../../../Api/EventBus/EventBus"
import {EventBus} from "../../../Api/EventBus/EventBus"
import {ReactiveObject} from "../../Reactive/ReactiveObject"
import VComponent from "../component/VComponent"
import ElementRef from "../ref/ElementRef"
import ComponentRef from "../ref/ComponentRef"
import FragmentRef from "../ref/FragmentRef"
import VCollection from "../list/VCollection"
import List from "../list/List"

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
}

export type Ref = ElementRef | FragmentRef | ComponentRef

export type VRNodeProps = {
    ref: Ref,
    attrs: VRAttrs,
    events: VREvents,
    dangerouslySetInnerHTML: any | boolean,
    children: Array<VRNodeProps | VRNode>,
    component?: VComponent,
    list?: List,
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
    reactiveCallbackContexts: Map<ReactiveObject, Map<string, BusEvent => any>>,
    appEventContexts: Map<EventBus, Map<string, BusEvent => any>>,
    reactiveCallbackAppEventContexts: Map<string, Map<EventBus, Map<string, BusEvent => any>>>,
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