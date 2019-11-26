import vdom_h from "./h"
import vdom_jsx from "./jsx"
import vdom_render from "./render"
import vdom_mount from "./mount"
import vdom_patchReal from "./patchReal"
import vdom_isVNode from "./check/isVNode"
import vdom_isSimpleComponent from "./check/isSimpleComponent"
import vdom_isNamedComponent from "./check/isNamedComponent"
import vdom_isComponent from "./check/isComponent"
import vdom_hasAttribute from "./check/hasAttribute"

/**
 * Simple Virtual DOM.
 *
 * - Patches directly virtual node to real $element.
 *
 * @author kohutd & tutorials from the internet
 */
export const VDOM = {
    h: vdom_h,
    jsx: vdom_jsx,
    render: vdom_render,
    patchReal: vdom_patchReal,
    mount: vdom_mount,

    isVNode: vdom_isVNode,
    isSimpleComponent: vdom_isSimpleComponent,
    isNamedComponent: vdom_isNamedComponent,
    isComponent: vdom_isComponent,
    hasAttribute: vdom_hasAttribute
}

export default VDOM
