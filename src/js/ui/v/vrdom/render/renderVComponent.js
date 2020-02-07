import vrdom_render from "./render"
import VF from "../../VFramework"
import ComponentVRNode from "../ComponentVRNode"
import {VComponent} from "../component/VComponent"
import VComponentVRNode from "../component/VComponentVRNode"

/**
 * @param {ComponentVRNode} vComponentVNode
 */
function vrdom_renderVComponentVNode(vComponentVNode: VComponentVRNode) {
    const componentInstance: VComponent = new (vComponentVNode.component)({
        props: vComponentVNode.attrs,
        slot: vComponentVNode.slot,
    })

    if (vComponentVNode.attrs.ref && vComponentVNode.attrs.ref.__component_ref) {
        vComponentVNode.attrs.ref.component = componentInstance
    }

    let identifier

    if (componentInstance.identifier) {
        identifier = String(componentInstance.identifier)
    } else if (vComponentVNode.identifier) {
        identifier = String(vComponentVNode.identifier)
        componentInstance.identifier = identifier
    } else {
        identifier = String(VF.latestInstantiatedComponent++)
        componentInstance.identifier = identifier
    }

    componentInstance.__init.bind(componentInstance)()

    const vNode = componentInstance.__render()

    if (vNode instanceof ComponentVRNode || vNode instanceof VComponentVRNode) {
        throw new Error("Components on top level are forbidden.")
    }

    vNode.attrs["data-component-id"] = identifier

    VF.mountedComponents.set(identifier, componentInstance)

    VF.plugins.forEach(plugin => plugin.componentCreated(componentInstance))

    const $node = vrdom_render(vNode)

    $node.__component = componentInstance
    componentInstance.$el = $node

    return $node
}


export default vrdom_renderVComponentVNode