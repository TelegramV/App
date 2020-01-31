import vrdom_mount from "../mount"
import patchAttrs from "./patchAttrs"
import patchEvents from "./patchEvents"
import patchDangerouslySetInnerHTML from "./patchDangerouslySetInnerHTML"
import VRNode from "../VRNode"
import ComponentVRNode from "../ComponentVRNode"
import patchChildren from "./patchChildren"
import V from "../../VFramework"

/**
 * Patches VRNode to Real DOM Element
 *
 * @param $node
 * @param newNode
 */
const vrdom_patch = <T: Element | Node | Text>($node: T, newNode: VRNode | ComponentVRNode | mixed): T => {
    if (newNode instanceof ComponentVRNode) {
        // console.log("[patch] component patch")

        if ($node.nodeType === Node.TEXT_NODE) {
            // $ignore
            return vrdom_mount(newNode, $node)
        }


        // $ignore
        if ($node.hasAttribute("data-component-id")) {
            // console.log("[patch component] $node component")


            // such components have self patching logic, so we should not touch them. but...
            console.warn("trying to patch class component, please avoid such behaviour")

            // $ignore
            const mounted = V.mountedComponents.get($node.getAttribute("data-component-id"))

            if (mounted) {
                if (!mounted.__.isPatchingItself) {
                    mounted.props = newNode.props
                    mounted.slot = newNode.slot

                    return mounted.__patch()
                }
            } else {
                // $ignore
                return vrdom_mount(newNode, $node)
            }
        } else {
            // $ignore
            return vrdom_mount(newNode, $node)
        }

    } else if (newNode instanceof VRNode) {
        // console.log("[patch] node patch")

        if ($node.nodeType === Node.TEXT_NODE) {
            // $ignore
            return vrdom_mount(newNode, $node)
        }

        // $ignore
        if ($node.hasAttribute("data-component-id")) {
            // console.log("[patch node] $node component")

            // $ignore
            const mounted = V.mountedComponents.get($node.getAttribute("data-component-id"))

            if (mounted) {

                if (!mounted.__.isPatchingItself) {
                    return mounted.__delete()
                }

            } else {
                // $ignore
                return vrdom_mount(newNode, $node)
            }
        }

        // $ignore
        if ($node.tagName.toLowerCase() !== newNode.tagName) {
            // $ignore
            return vrdom_mount(newNode, $node)
        }

        patchAttrs($node, newNode.attrs)
        patchEvents($node, newNode.events)

        if (newNode.dangerouslySetInnerHTML !== false) {
            patchDangerouslySetInnerHTML($node, newNode.dangerouslySetInnerHTML)
        } else {
            patchChildren($node, $node.childNodes, newNode.children)
        }

        V.plugins.forEach(plugin => plugin.elementPatched($node))

        return $node

    } else if (newNode === undefined) {
        // console.log("[patch] undefined")

        if ($node.nodeType === Node.TEXT_NODE) {
            // $ignore
            $node.remove()
            // $ignore
            return undefined
        }

        // $ignore
        if ($node.hasAttribute("data-component-id")) {
            // console.log("[patch undefined] $node component")

            // $ignore
            const component = V.mountedComponents.get($node.getAttribute("data-component-id"))

            if (component) {
                component.__delete()
            } else {
                console.warn("component was not found")
            }

        } else {
            // $ignore
            $node.remove()
        }

        // $ignore
        return undefined

    } else {

        if ($node.nodeType === Node.TEXT_NODE) {
            if ($node.textContent !== String(newNode)) {
                // $ignore
                return vrdom_mount(newNode, $node)
            }

            return $node
        }

        // $ignore
        if ($node.hasAttribute("data-component-id")) {
            // console.log("[patch undefined] $node unexpected")

            // $ignore
            const component = V.mountedComponents.get($node.getAttribute("data-component-id"))

            if (component) {
                component.__delete()
            } else {
                console.warn("component was not found")
            }

        } else {
            // $ignore
            return vrdom_mount(newNode, $node)
        }

    }
}

export default vrdom_patch