/**
 * (c) Telegram V
 */

import type {VRNodeProps, VRTagName} from "./types/types"
import VRNode from "./VRNode"
import VComponent from "./component/VComponent"
import VComponentVRNode from "./component/VComponentVRNode"

/**
 * Creates VRNode
 *
 * @param tagName
 * @param props
 */
function vrdom_createElement(tagName: VRTagName, props: VRNodeProps): VRNode | VComponentVRNode {
    if (typeof tagName === "function") {
        if (tagName.prototype instanceof VComponent) {
            return new VComponentVRNode(tagName, {attrs: props.attrs, ref: props.ref}, props.children)
        } else {
            if (props.ref && props.ref.__fragment_ref) {
                props.ref.slot = props.children.length > 0 ? props.children : undefined
                props.ref.props = props.attrs

                if (props.ref.fragment) {
                    return props.ref.fragment({...props.attrs, slot: props.children})
                } else {
                    props.ref.fragment = tagName

                    const node = tagName({...props.attrs, slot: props.children})
                    node.ref = props.ref
                    return node
                }
            } else {
                return tagName({...props.attrs, slot: props.children})
            }
        }
    }

    return new VRNode(tagName, props)
}

export default vrdom_createElement