/**
 * (c) Telegram V
 */

import type {VRAttrs, VREvents, VRNodeProps, VRTagName} from "./types/types"

class VRNode {

    __vrnode: boolean = true

    tagName: VRTagName

    attrs: VRAttrs = {}
    events: VREvents = new Map()
    children: Array<VRNode> = []
    style: Object
    ref: Object

    dangerouslySetInnerHTML: any | boolean = false
    isComponentRoot: boolean = false

    constructor(tagName: VRTagName, props: VRNodeProps) {
        this.tagName = tagName

        this.attrs = props.attrs || {}
        this.events = props.events || new Map()
        this.children = props.children || []
        this.style = props.style || {}
        this.ref = props.ref

        this.dangerouslySetInnerHTML = props.dangerouslySetInnerHTML || false
        this.isComponentRoot = props.isComponentRoot || false
    }
}

export default VRNode