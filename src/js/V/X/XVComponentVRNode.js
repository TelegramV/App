/**
 * (c) Telegram V
 */
import XVComponent from "./Component/XVComponent"
import type {VComponentVRNodeProps, VRAttrs, VRSlot} from "../VRDOM/types/types"

class XVComponentVRNode {

    __vrcomponent: boolean = true

    component: XVComponent

    attrs: VRAttrs = {}

    slot: VRSlot

    identifier: string | void

    constructor(component: XVComponent, props: VComponentVRNodeProps, slot?: VRSlot) {
        this.component = component
        this.attrs = props.attrs
        this.slot = slot
        this.identifier = props.identifier
    }
}

export default XVComponentVRNode