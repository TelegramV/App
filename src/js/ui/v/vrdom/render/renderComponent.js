import vrdom_render from "./render"
import V from "../../VFramework"
import ComponentVRNode from "../ComponentVRNode"
import Component from "../Component"

/**
 * @param {ComponentVRNode} componentVNode
 */
function vrdom_renderComponentVNode(componentVNode: ComponentVRNode) {
    const componentInstance: Component = new (componentVNode.component)({
        props: componentVNode.props,
        slot: componentVNode.slot,
    })

    if (componentVNode.props.ref && componentVNode.props.ref.__component_ref) {
        componentVNode.props.ref.component = componentInstance
    }

    const newId = componentInstance.identifier ? String(componentInstance.identifier) : String(typeof componentVNode.ref === "string" ? componentVNode.ref : V.latestInstantiatedComponent++)

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

    const $node = vrdom_render(vNode)

    $node.__component = componentInstance
    componentInstance.$el = $node

    return $node
}


export default vrdom_renderComponentVNode