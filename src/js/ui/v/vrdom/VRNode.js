import type {VRAttrs, VREvents, VRNodeProps, VRTagName} from "./types/types"

class VRNode {

    __vrnode: boolean = true

    tagName: VRTagName

    attrs: VRAttrs = {}

    events: VREvents = new Map()

    dangerouslySetInnerHTML: any | boolean = false

    children: Array<VRNode> = []

    constructor(tagName: VRTagName, props: VRNodeProps) {
        this.tagName = tagName

        this.attrs = props.attrs || {}
        this.events = props.events || new Map()

        this.dangerouslySetInnerHTML = props.dangerouslySetInnerHTML || false

        this.children = props.children || []
    }
}

export default VRNode