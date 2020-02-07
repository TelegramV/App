import vrdom_mount from "../mount"
import patchAttrs from "./patchAttrs"
import patchEvents from "./patchEvents"
import patchDangerouslySetInnerHTML from "./patchDangerouslySetInnerHTML"
import VRNode from "../VRNode"
import ComponentVRNode from "../ComponentVRNode"
import patchChildren from "./patchChildren"
import VF from "../../VFramework"
import patchComponentVRNode from "./patchComponent"
import patchUndefined from "./patchUndefined"
import patchText from "./patchText"
import VComponentVRNode from "../component/VComponentVRNode"
import patchTextArea from "./patchTextArea"

/**
 * Patches VRNode to Real DOM Element
 *
 * @param $node
 * @param newNode
 */
const vrdom_patch = <T: Element | Node | Text>($node: T, newNode: VRNode | VComponentVRNode | ComponentVRNode | mixed): T => {
    if ($node === undefined) {
        console.error("BUG: `undefined` was passed as $node ")
        return $node
    }

    if (newNode instanceof VRNode) {
        // console.log("[patch] node patch")

        if ($node.nodeType === Node.TEXT_NODE) {
            return vrdom_mount(newNode, $node)
        }

        if ($node.__component) {
            if (!$node.__component.__.isPatchingItself) {
                return $node.__component.__delete()
            }
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
            patchChildren($node, $node.childNodes, newNode.children)
        }

        VF.plugins.forEach(plugin => plugin.elementPatched($node))

        return $node

    } else if (newNode instanceof ComponentVRNode || newNode instanceof VComponentVRNode) {
        // console.log("[patch] component patch")

        return patchComponentVRNode($node, newNode)


    } else if (newNode === undefined) {
        // console.log("[patch] undefined")

        return patchUndefined($node)

    } else {


        if ($node.nodeType === Node.TEXT_NODE) {
            return patchText($node, newNode)
        }

        if ($node.__component) {
            // console.log("[patch undefined] $node unexpected")

            $node.__component.__delete()

        } else {
            return vrdom_mount(newNode, $node)
        }

        return $node

    }
}

export default vrdom_patch