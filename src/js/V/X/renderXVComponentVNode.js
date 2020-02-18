import XVComponentVRNode from "./XVComponentVRNode"
import XVComponent from "./Component/XVComponent"
import ComponentVRNode from "../VRDOM/ComponentVRNode"
import VComponentVRNode from "../VRDOM/component/VComponentVRNode"
import vrdom_render from "../VRDOM/render/render"

export function vrdom_instantiateXVComponentVNode(node: XVComponentVRNode) {
    const componentInstance: XVComponent = new (node.component)({
        props: node.attrs,
        slot: node.slot,
    })

    componentInstance.__init.call(componentInstance)

    return componentInstance
}

export default function vrdom_renderXVComponentVNode(node: XVComponentVRNode, $node: HTMLElement = undefined) {
    const componentInstance = vrdom_instantiateXVComponentVNode(node)


    if (!$node) {
        const renderedVRNode = componentInstance.render()

        if (renderedVRNode instanceof ComponentVRNode || renderedVRNode instanceof VComponentVRNode) {
            throw new Error("Components on top level are forbidden.")
        }

        $node = vrdom_render(renderedVRNode)
    }

    $node.__component = componentInstance
    componentInstance.$el = $node

    return $node
}