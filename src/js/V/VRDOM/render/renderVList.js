import {VListVRNode} from "../list/VListVRNode"
import vrdom_append from "../append"
import type {VRRenderProps} from "../types/types"
import VF from "../../VFramework"
import vrdom_render from "./render"

function vrdom_renderVListVRNode(node: VListVRNode, props: VRRenderProps) {
    const list = new (node.tag)({list: node.list, template: node.template})
    list.identifier = ++VF.latestInstantiatedComponent
    list.$el = vrdom_render(node.wrapper)
    list.$el.__list = list

    const items = list.render()
    items.forEach(value => {
        list.childNodes.push(vrdom_append(value, list.$el, {xmlns: props.xmlns}))
    })

    return list.$el
}

export default vrdom_renderVListVRNode