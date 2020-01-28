import vrdom_render from "./render"
import V from "../VFramework"
import ComponentVRNode from "./ComponentVRNode"
import Component from "./Component"

let latestInstantiatedComponent = 0

/**
 * @param {ComponentVRNode} componentVNode
 */
function vrdom_renderComponentVNode(componentVNode: ComponentVRNode) {
    const componentInstance: Component = new (componentVNode.component)({
        props: componentVNode.props,
        slot: componentVNode.slot,
    })

    const newId = String(componentVNode.ref ? componentVNode.ref : latestInstantiatedComponent++)

    componentInstance.identifier = newId
    componentInstance.__init.bind(componentInstance)()

    const vNode = componentInstance.h()

    if (vNode instanceof ComponentVRNode) {
        throw new Error("Components on top level are forbidden.")
    }

    vNode.attrs["data-component-id"] = newId

    V.mountedComponents.set(newId, componentInstance)

    componentInstance.__created()
    componentInstance.created()
    V.plugins.forEach(plugin => plugin.componentCreated(componentInstance))
    componentInstance.__.created = true

    return vrdom_render(vNode)
}


export default vrdom_renderComponentVNode