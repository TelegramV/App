/**
 * (c) Telegram V
 */

import vrdom_render from "./render"
import VF from "../../VFramework"
import VComponent from "../component/VComponent"
import VComponentVRNode from "../component/VComponentVRNode"

export function vrdom_instantiateVComponentVNode(node: VComponentVRNode) {
    const componentInstance: VComponent = new (node.component)({
        props: node.attrs,
        slot: node.slot,
    })

    if (node.ref && node.ref.__component_ref) {
        node.ref.component = componentInstance
    }

    if (componentInstance.identifier) {
        componentInstance.identifier = String(componentInstance.identifier)
    } else if (node.identifier) {
        componentInstance.identifier = String(node.identifier)
    } else {
        componentInstance.identifier = String(VF.latestInstantiatedComponent++)
    }

    componentInstance.__init.call(componentInstance)

    return componentInstance
}

/**
 * @param {VComponentVRNode} node
 * @param $node
 */
function vrdom_renderVComponentVNode(node: VComponentVRNode, $node: HTMLElement = undefined) {
    const componentInstance = vrdom_instantiateVComponentVNode(node)

    if ($node === undefined) {
        const renderedVRNode = componentInstance.__render()

        if (renderedVRNode instanceof VComponentVRNode) {
            throw new Error("Components on top level are forbidden.")
        }

        $node = vrdom_render(renderedVRNode)
    }

    $node.__component = componentInstance
    componentInstance.$el = $node

    return $node
}


export default vrdom_renderVComponentVNode