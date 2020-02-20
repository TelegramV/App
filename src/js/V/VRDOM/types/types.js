/**
 * (c) Telegram V
 */

import VRNode from "../VRNode"
import type {BusEvent} from "../../../Api/EventBus/EventBus"
import {EventBus} from "../../../Api/EventBus/EventBus"
import type {ReactiveCallbackContext} from "../../Reactive/ReactiveCallback"
import {ReactivePublisher} from "../../../Api/EventBus/ReactivePublisher"
import {ReactiveObject} from "../../Reactive/ReactiveObject"
import VComponent from "../component/VComponent"

export type VRTagName = string | number | ({ ...VRAttrs, slot?: VRSlot }) => VRNode | Class<VComponent>

export type VRAttrs = {
    [string]: any
}

export type VREvents =
    Map<string, (event: Event) => void>

export type VRRenderProps = {
    xmlns: string | void
}

export type VRNodeProps = {
    ref: Object,
    attrs: VRAttrs,
    events: VREvents,
    dangerouslySetInnerHTML: any | boolean,
    children: Array<VRNodeProps | VRNode>,
    isComponentRoot: boolean,
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

export type ComponentReactiveState = {
    [string]: ReactiveCallbackContext | ReactivePublisher
}