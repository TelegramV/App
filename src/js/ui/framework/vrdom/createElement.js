import {VRNode} from "./VRNode"
import {ComponentVRNode} from "./componentVRNode"
import Component from "./component"

/**
 * @param {function} tagName
 * @param props
 * @return {VRNode|ComponentVRNode}
 */
function vrdom_createElement(tagName, props) {
    if (typeof tagName === "function") {
        if (tagName.prototype instanceof Component) {
            return new ComponentVRNode(tagName, props.attrs, props.children)
        } else {
            return tagName({...props.attrs, slot: props.children})
        }
    }

    return new VRNode(tagName, props)
}

export default vrdom_createElement