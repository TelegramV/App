/**
 * (c) Telegram V
 */

import type {VRNodeProps, VRTagName} from "./types/types"
import Component from "./Component"
import ComponentVRNode from "./ComponentVRNode"
import VRNode from "./VRNode"
import {VComponent} from "./component/VComponent"
import VComponentVRNode from "./component/VComponentVRNode"
import {List} from "./List"
import {VListVRNode} from "./VListVRNode"
import XVComponent from "../X/Component/XVComponent"
import XVComponentVRNode from "../X/XVComponentVRNode"

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
        } else if (tagName.prototype instanceof VComponent) {
            return new VComponentVRNode(tagName, {attrs: props.attrs, ref: props.attrs.ref}, props.children)
        } else if (tagName.prototype instanceof XVComponent) {
            return new XVComponentVRNode(tagName, {attrs: props.attrs, ref: props.attrs.ref}, props.children)
        } else if (tagName === List) {
            return new VListVRNode(tagName, props.attrs)
        } else {
            if (props.ref && props.ref.__fragment_ref) {
                props.ref.slot = props.children
                props.ref.props = props.attrs
                if (props.ref.fragment) {
                    return props.ref.fragment({...props.attrs, slot: props.children})
                } else {
                    props.ref.fragment = tagName

                    const node = tagName({...props.attrs, slot: props.children})
                    node.attrs.ref = props.ref
                    return node
                }
            } else {
                return tagName({...props.attrs, slot: props.children})
            }
        }
    }

    // console.log("creating", tagName)

    return new VRNode(tagName, props)
}

export default vrdom_createElement