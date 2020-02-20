/**
 * (c) Telegram V
 */

import vrdom_delete from "../delete"
import VRNode from "../VRNode"
import vrdom_append from "../append"
import vrdom_patch from "./patch"

/**
 * @param {Element} $node
 * @param {Array<VRNode | any>} vRNode
 */
const patchChildren = ($node: Element, vRNode: VRNode) => {
    const $children = $node.childNodes
    const children = vRNode.children

    $children.forEach(($oldChild, i) => {
        vrdom_patch($oldChild, children[i])
    })

    if (children.length > $children.length) {
        for (let i = $children.length; i < children.length; i++) {
            vrdom_append(children[i], $node)
        }
    } else if (children.length < $children.length) {
        Array.from($children.values()).slice(children.length).forEach($node => {
            vrdom_delete($node)
        })
    }
}

export default patchChildren