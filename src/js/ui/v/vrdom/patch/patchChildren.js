import vrdom_patch from "./patch"
import vrdom_delete from "../delete"
import VRNode from "../VRNode"
import vrdom_append from "../append"

/**
 * @param {Element} $parent
 * @param {NodeListOf<ChildNode>} $children
 * @param {Array<VRNode | any>} newChildren
 */
const patchChildren = ($parent: Element, $children: NodeListOf<ChildNode>, newChildren: Array<VRNode | mixed>) => {
    $children.forEach(($oldChild, i) => {
        vrdom_patch($oldChild, newChildren[i])
    })

    if (newChildren.length > $children.length) {
        for (let i = $children.length; i < newChildren.length; i++) {
            vrdom_append(newChildren[i], $parent)
        }
    } else if (newChildren.length < $children.length)
        Array.from($children.values()).slice(newChildren.length).forEach($node => {
            vrdom_delete($node)
        })
}

export default patchChildren