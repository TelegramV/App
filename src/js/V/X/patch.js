import VRNode from "../VRDOM/VRNode"
import vrdom_mount from "../VRDOM/mount"
import patchAttrs from "../VRDOM/patch/patchAttrs"
import patchEvents from "../VRDOM/patch/patchEvents"
import patchDangerouslySetInnerHTML from "../VRDOM/patch/patchDangerouslySetInnerHTML"
import patchChildren from "../VRDOM/patch/patchChildren"
import XVComponentVRNode from "./XVComponentVRNode"
import patchUndefined from "../VRDOM/patch/patchUndefined"
import patchText from "../VRDOM/patch/patchText"
import vrdom_renderXVComponentVNode from "./renderXVComponentVNode"

export default function xvrdom_patch($node, vRNode: VRNode) {
    if ($node === undefined) {
        console.error("BUG: `undefined` was passed as $node ")
        return $node
    }

    // console.log("patching", $node, vRNode)

    if (vRNode instanceof VRNode) {
        if ($node.nodeType === Node.TEXT_NODE) {
            return vrdom_mount(vRNode, $node)
        }

        if ($node.__component) {
            if (!$node.__component.__.isUpdatingItSelf) {
                $node.__component.__unmount()
            }

            if ($node.tagName.toLowerCase() !== vRNode.tagName) {
                $node.__component.$el = undefined
                const $newNode = vrdom_mount(vRNode, $node)
                $newNode.__component = $node.__component
                $node.__component = undefined
                return $newNode
            }
        } else {
            if ($node.tagName.toLowerCase() !== vRNode.tagName) {
                return vrdom_mount(vRNode, $node)
            }
        }

        patchAttrs($node, vRNode.attrs)
        patchEvents($node, vRNode.events)

        if (vRNode.dangerouslySetInnerHTML !== false) {
            patchDangerouslySetInnerHTML($node, vRNode.dangerouslySetInnerHTML)
        } else {
            patchChildren($node, $node.childNodes, vRNode.children)
        }

        return $node
    } else if (vRNode instanceof XVComponentVRNode) {
        if ($node.nodeType === Node.TEXT_NODE) {
            return vrdom_mount(vRNode, $node)
        }

        if ($node.__component) {
            if ($node.__component.constructor === vRNode.component) {
                if (!$node.__component.__.isUpdatingItSelf) {
                    $node.__component.__update({
                        nextProps: vRNode.attrs,
                    })
                }
            } else {
                $node.__component.__unmount()
                $node = vrdom_renderXVComponentVNode(vRNode, $node)
                $node.__component.__mount.call($node.__component, $node)
                $node.__component.forceUpdate()
            }
        } else {
            $node.__component.__unmount()
            $node = vrdom_renderXVComponentVNode(vRNode, $node)
            $node.__component.__mount.call($node.__component, $node)
            $node.__component.forceUpdate()
        }

        return $node
    } else if (vRNode === undefined) {
        // console.log("[patch] undefined")

        return patchUndefined($node)

    } else {
        // console.log("[patch] unexpected", $node, vRNode)

        if ($node.nodeType === Node.TEXT_NODE) {
            return patchText($node, vRNode)
        }

        if ($node.__component) {
            console.log("[patch undefined] $node unexpected")

            $node.__component.__unmount()

        } else {
            return vrdom_mount(vRNode, $node)
        }

        return vrdom_mount(vRNode, $node)

    }
}