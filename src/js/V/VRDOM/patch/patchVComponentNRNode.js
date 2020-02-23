/**
 * (c) Telegram V
 */

import VComponentVRNode from "../component/VComponentVRNode"
import vrdom_renderVComponentVNode from "../render/renderVComponent"

const patchVComponentVRNode = ($node: Element, vRNode: VComponentVRNode) => {
    if ($node.__component) {
        if ($node.__component.constructor === vRNode.component) {
            if (!$node.__component.__.isUpdatingItSelf) {
                $node.__component.__update({
                    nextProps: vRNode.attrs,
                })
            }
        } else {
            $node.__component.__unmount()
            $node = vrdom_renderVComponentVNode(vRNode, $node)
            $node.__component.__mount.call($node.__component, $node)
            $node.__component.forceUpdate()
        }
    } else {
        $node = vrdom_renderVComponentVNode(vRNode, $node)
        $node.__component.__mount.call($node.__component, $node)
        $node.__component.forceUpdate()
    }

    return $node
}

export default patchVComponentVRNode