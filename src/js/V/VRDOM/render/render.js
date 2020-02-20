/**
 * (c) Telegram V
 */

import VRNode from "../VRNode"
import type {VRRenderProps} from "../types/types"
import renderElement from "./renderElement"
import renderText from "./renderText"
import vrdom_renderVComponentVNode from "./renderVComponent"
import VComponentVRNode from "../component/VComponentVRNode"

/**
 * Creates Real DOM Element from VRNode
 *
 * @param node
 * @param props
 */
function vrdom_render(node: VRNode, props?: VRRenderProps): HTMLElement | Element | Node | Text {

    if (node instanceof VComponentVRNode) {
        return vrdom_renderVComponentVNode(node)
    }

    if (node instanceof VRNode) {
        return renderElement(node, {xmlns: props ? props.xmlns : undefined})
    } else if (!node) {
        return renderText(node)
    } else {
        if (typeof node === "object") {
            return renderText(JSON.stringify(node))
        } else {
            return renderText(node)
        }
    }

}

export default vrdom_render