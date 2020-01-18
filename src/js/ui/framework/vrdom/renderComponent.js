import vrdom_render from "./render"
import AppFramework from "../framework"

let latestInstantiatedComponent = 0

/**
 * @param {ComponentVRNode} componentVNode
 */
function vrdom_renderComponentVNode(componentVNode) {
    /**
     * @type {Component}
     */
    const componentInstance = new (componentVNode.component)

    const newId = componentVNode.ref ? componentVNode.ref : latestInstantiatedComponent++

    componentInstance.identifier = newId
    componentInstance.__init.bind(componentInstance)()
    componentInstance.props = componentVNode.props
    componentInstance.slot = componentVNode.slot

    const vNode = componentInstance.h()

    vNode.attrs["data-component-id"] = newId

    AppFramework.mountedComponents.set(String(newId), componentInstance)

    componentInstance.created()
    componentInstance.__.created = true

    return vrdom_render(vNode)
}


export default vrdom_renderComponentVNode