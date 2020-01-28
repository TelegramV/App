import type {VRNodeProps, VRTagName} from "./types/types"
import Component from "./Component"
import ComponentVRNode from "./ComponentVRNode"
import VRNode from "./VRNode"

/**
 * Creates VRNode
 *
 * @param tagName
 * @param props
 */
function vrdom_createElement(tagName: VRTagName, props: VRNodeProps): VRNode | ComponentVRNode {
    if (typeof tagName === "function") {
        if (tagName.prototype instanceof Component) {
            return new ComponentVRNode(tagName, props.attrs, props.children)
        } else {
            return tagName({...props.attrs, slot: props.children})
        }
    }

    // console.log("creating", tagName)

    return new VRNode(tagName, props)
}

export default vrdom_createElement