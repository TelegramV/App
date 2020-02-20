/**
 * (c) Telegram V
 */

import vrdom_mount from "../mount"
import patchAttrs from "./patchAttrs"
import patchEvents from "./patchEvents"
import patchDangerouslySetInnerHTML from "./patchDangerouslySetInnerHTML"
import VRNode from "../VRNode"
import patchChildren from "./patchChildren"
import patchVRNodeUndefined from "./patchVRNodeUndefined"
import VComponentVRNode from "../component/VComponentVRNode"
import patchVRNodeNull from "./patchNull"
import patchNodeText from "./patchText"
import patchVComponentVRNode from "./patchVComponentNRNode"
import patchStyle from "./patchStyle"
import vrdom_deleteInner from "../deleteInner"
import patchClass from "./patchClass"
import VF from "../../VFramework"

const recreateNodeOnlyTagName = ($node, tagName) => {
    const $newNode = document.createElement(tagName)

    while ($node.childNodes.length > 0) {
        $newNode.appendChild($node.childNodes[0])
    }

    $newNode.__component = $node.__component
    $node.__component = undefined

    return $newNode
}

/**
 * Patches VRNode to Real DOM Element
 *
 * @param $node
 * @param vRNode
 */
const vrdom_patch = <T: Element | Node | Text>($node: T, vRNode: VRNode | VComponentVRNode): T => {
    if ($node === undefined) {
        console.error("BUG: `undefined` was passed as $node ")
        return $node
    }

    const $oldNode = $node

    if (vRNode instanceof VRNode) {
        if ($node.nodeType === Node.TEXT_NODE) {
            return vrdom_mount(vRNode, $node)
        }

        if ($node.__component) {
            if (!$node.__component.__.isUpdatingItSelf) {
                $node.__component.__unmount()
            }
        }

        if ($node.tagName.toLowerCase() !== vRNode.tagName) {
            $node = recreateNodeOnlyTagName($node, vRNode.tagName)
        }

        patchAttrs($node, vRNode.attrs)
        // patchClass($node, vRNode.attrs["class"])
        patchEvents($node, vRNode.events)
        patchStyle($node, vRNode.style)

        if (vRNode.dangerouslySetInnerHTML !== false) {
            patchDangerouslySetInnerHTML($node, vRNode.dangerouslySetInnerHTML)
        } else {
            patchChildren($node, vRNode)
        }

        if ($oldNode !== $node) {
            $oldNode.__component = undefined
            $oldNode.replaceWith($node)
        }

        VF.plugins.forEach(plugin => plugin.elementPatched($node))

        return $node
    } else if (vRNode instanceof VComponentVRNode) {
        // console.log("[patch] VComponent")

        return patchVComponentVRNode($node, vRNode)
    } else if (vRNode === undefined) {
        // console.log("[patch] undefined")

        return patchVRNodeUndefined($node)

    } else if (vRNode === null) {
        // console.log("[patch] undefined")

        return patchVRNodeNull($node)

    } else {
        // console.log("[patch] unexpected", $node, vRNode)

        if ($node.__component) {
            $node.__component.__unmount()
        }

        if ($node.nodeType === Node.TEXT_NODE) {
            return patchNodeText($node, vRNode)
        }

        vrdom_deleteInner($node)

        return vrdom_mount(vRNode, $node)

    }
}

export default vrdom_patch