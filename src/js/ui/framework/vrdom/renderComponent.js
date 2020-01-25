import vrdom_render from "./render"
import AppFramework from "../framework"
import {ComponentVRNode} from "./componentVRNode"

let latestInstantiatedComponent = 0

/**
 * @param {ComponentVRNode} componentVNode
 */
function vrdom_renderComponentVNode(componentVNode) {
    /**
     * @type {Component}
     */
    const componentInstance = new (componentVNode.component)({
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

    AppFramework.MountedComponents.set(newId, componentInstance)

    componentInstance.__created()
    componentInstance.created()
    AppFramework.Plugins.forEach(plugin => plugin.componentCreated(componentInstance))
    componentInstance.__.created = true

    return vrdom_render(vNode)
}


export default vrdom_renderComponentVNode