import VRNode from "../VRNode"
import {EventBus} from "../../../../api/eventBus/EventBus"

export type VRTagName = string | number | ({ ...VRAttrs, slot?: VRSlot }) => VRNode | Class<Component>

export type VRAttrs = {
    [key: string]: any
}

export type VREvents =
    Map<string, (event: Event) => void>

export type VRRenderProps = {
    xmlns: string | void
}

export type VRNodeProps = {
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

export type ComponentMeta = {
    inited: boolean,
    created: boolean,
    mounted: boolean,
    isPatchingItself: boolean,
    reactiveContexts: Map<string, any>,
    appEventContexts: Map<EventBus, Map<string, any>>,
    reactiveInited: boolean,
}

export type ComponentProps = {
    name?: string,
    props?: VRAttrs,
    slot?: VRSlot,
}

export type ComponentState = {
    [key: string]: any
}

export type ComponentReactiveState = {
    [key: string]: any
}