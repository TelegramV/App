/**
 * (c) Telegram V
 */

import type {ComponentVRNodeProps, VRAttrs, VRSlot} from "./types/types"
import Component from "./Component"

class ComponentVRNode {

    __vrcomponent: boolean = true

    component: Component

    props: VRAttrs = {}

    slot: VRSlot

    ref: string | void

    constructor(component: Component, props: ComponentVRNodeProps, slot?: VRSlot) {
        this.component = component
        this.props = props || {}
        this.slot = slot
        this.ref = props.ref
    }
}

export default ComponentVRNode