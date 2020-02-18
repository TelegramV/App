/**
 * (c) Telegram V
 */

import ComponentVRNode from "../ComponentVRNode"
import VRNode from "../VRNode"
import type {VRRenderProps} from "../types/types"
import vrdom_renderComponentVNode from "./renderComponent"
import renderElement from "./renderElement"
import renderText from "./renderText"
import vrdom_renderVComponentVNode from "./renderVComponent"
import VComponentVRNode from "../component/VComponentVRNode"
import vrdom_renderXVComponentVNode from "../../X/renderXVComponentVNode"
import XVComponentVRNode from "../../X/XVComponentVRNode"

/**
 * Creates Real DOM Element from VRNode
 *
 * @param node
 * @param props
 */
function vrdom_render(node: VRNode | ComponentVRNode, props?: VRRenderProps): HTMLElement | Element | Node | Text {

    if (node instanceof ComponentVRNode) {
        return vrdom_renderComponentVNode(node)
    } else if (node instanceof VComponentVRNode) {
        return vrdom_renderVComponentVNode(node)
    } else if (node instanceof XVComponentVRNode) {
        return vrdom_renderXVComponentVNode(node)
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