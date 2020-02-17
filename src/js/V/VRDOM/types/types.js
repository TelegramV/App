/**
 * (c) Telegram V
 */

import VRNode from "../VRNode"
import type {BusEvent} from "../../../Api/EventBus/EventBus"
import {EventBus} from "../../../Api/EventBus/EventBus"
import type {ReactiveCallbackContext} from "../../Reactive/ReactiveCallback"
import {ReactivePublisher} from "../../../Api/EventBus/ReactivePublisher"
import Component from "../Component"
import {ReactiveObject} from "../../Reactive/ReactiveObject"

export type VRTagName = string | number | ({ ...VRAttrs, slot?: VRSlot }) => VRNode | Class<Component>

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
}

export type VRSlot = VRNode | void

export type ComponentVRNodeProps = {
    props: VRAttrs,
    ref: string | void
}

export type VComponentVRNodeProps = {
    attrs: VRAttrs,
    identifier: string | void
}

export type ComponentMeta = {
    inited: boolean,
    created: boolean,
    mounted: boolean,
    isPatchingItself: boolean,
    reactiveContexts: Map<string, ReactiveCallbackContext>,
    reactiveObjectContexts: Map<string, ReactiveCallbackContext>,
    reactiveInited: boolean,
}

export type VComponentMeta = {
    inited: boolean,
    // created: boolean,
    mounted: boolean,
    destroyed: boolean,
    isPatchingItself: boolean,
    reactiveObjectContexts: Map<ReactiveObject, Map<string, BusEvent => any>>,
    reactiveCallbackContexts: Map<ReactiveObject, Map<string, BusEvent => any>>,
    appEventContexts: Map<EventBus, Map<string, BusEvent => any>>,
    reactiveCallbackAppEventContexts: Map<string, Map<EventBus, Map<string, BusEvent => any>>>,
    intervals: Set<number>,
    timeouts: Set<number>,
    reactiveInited: boolean,
    stateInTransactionMode: boolean,
}

export type ComponentProps = {
    name?: string,
    props?: VRAttrs,
    slot?: VRSlot,
}

export type ComponentState = {
    [string]: any
}

export type ComponentReactiveState = {
    [string]: ReactiveCallbackContext | ReactivePublisher
}