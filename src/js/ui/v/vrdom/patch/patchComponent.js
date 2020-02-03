import ComponentVRNode from "../ComponentVRNode"
import vrdom_mount from "../mount"
import Component from "../Component"

const patchComponentVRNode = ($node: Element, newNode: ComponentVRNode) => {
    if ($node.nodeType === Node.TEXT_NODE) {
        return vrdom_mount(newNode, $node)
    }

    if ($node.__component instanceof Component) {
        if (!$node.__component.__.isPatchingItself) {
            $node.__component.props = newNode.props
            $node.__component.slot = newNode.slot

            return $node.__component.__patch()
        }
    } else {
        return vrdom_mount(newNode, $node)
    }
}

export default patchComponentVRNode