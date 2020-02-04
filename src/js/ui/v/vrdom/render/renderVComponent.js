import vrdom_render from "./render"
import V from "../../VFramework"
import ComponentVRNode from "../ComponentVRNode"
import {VComponent} from "../component/VComponent"
import VComponentVRNode from "../component/VComponentVRNode"

let latestInstantiatedComponent = 0

/**
 * @param {ComponentVRNode} vComponentVNode
 */
function vrdom_renderVComponentVNode(vComponentVNode: VComponentVRNode) {
    const componentInstance: VComponent = new (vComponentVNode.component)({
        props: vComponentVNode.attrs,
        slot: vComponentVNode.slot,
    })

    let identifier

    if (componentInstance.identifier) {
        identifier = componentInstance.identifier
    } else if (vComponentVNode.identifier) {
        identifier = String(vComponentVNode.identifier)
        componentInstance.identifier = identifier
    } else {
        identifier = latestInstantiatedComponent++
        componentInstance.identifier = identifier
    }

    componentInstance.__init.bind(componentInstance)()

    const vNode = componentInstance.__render()

    if (vNode instanceof ComponentVRNode || vNode instanceof VComponentVRNode) {
        throw new Error("Components on top level are forbidden.")
    }

    vNode.attrs["data-component-id"] = identifier

    V.mountedComponents.set(identifier, componentInstance)

    V.plugins.forEach(plugin => plugin.componentCreated(componentInstance))

    const $node = vrdom_render(vNode)

    $node.__component = componentInstance
    componentInstance.$el = $node

    return $node
}


export default vrdom_renderVComponentVNode