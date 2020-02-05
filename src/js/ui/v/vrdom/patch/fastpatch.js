import VRNode from "../VRNode"
import vrdom_mount from "../mount"
import patchAttrs from "./patchAttrs"
import patchEvents from "./patchEvents"
import patchDangerouslySetInnerHTML from "./patchDangerouslySetInnerHTML"
import patchChildren from "./patchChildren"
import V from "../../VFramework"
import patchUndefined from "./patchUndefined"
import patchText from "./patchText"
import patchTextArea from "./patchTextArea"

/**
 * Ignores any component.
 *
 * @param $node
 * @param newNode
 */
const vrdom_fastpatch = <T: Element | Node | Text>($node: T, newNode: VRNode | mixed): T => {
    if ($node === undefined) {
        console.error("BUG: `undefined` was passed as $node ")
        return $node
    }

    if (newNode instanceof VRNode) {

        if ($node.nodeType === Node.TEXT_NODE) {
            return vrdom_mount(newNode, $node)
        }

        // ignoring component if it is not patching itself
        if ($node.__component && !$node.__component.__.isPatchingItself) {
            return $node
        }

        if ($node.tagName.toLowerCase() !== newNode.tagName) {
            return vrdom_mount(newNode, $node)
        }

        patchAttrs($node, newNode.attrs)
        patchEvents($node, newNode.events)

        if (newNode.dangerouslySetInnerHTML !== false) {
            patchDangerouslySetInnerHTML($node, newNode.dangerouslySetInnerHTML)
        } else if ($node instanceof HTMLTextAreaElement) {
            patchTextArea($node, newNode)
        } else {
            patchChildren($node, $node.childNodes, newNode.children, true)
        }

        V.plugins.forEach(plugin => plugin.elementPatched($node))

        return $node

    } else if (newNode === undefined) {

        return patchUndefined($node)

    } else {

        if ($node.nodeType === Node.TEXT_NODE) {
            return patchText($node, newNode)
        }

        return $node

    }
}

export default vrdom_fastpatch