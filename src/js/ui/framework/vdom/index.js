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
import vdom_appendToReal from "./appendToReal"
import vdom_prependToReal from "./prependToReal"
import vdom_createEmptyNode from "./createEmptyNode"

/**
 * Simple Virtual DOM.
 *
 * - Patches directly virtual node to real $element.
 *
 * @author kohutd
 */
const VDOM = {
    h: vdom_h,
    jsx: vdom_jsx,
    render: vdom_render,
    patchReal: vdom_patchReal,

    isVNode: vdom_isVNode,
    isSimpleComponent: vdom_isSimpleComponent,
    isNamedComponent: vdom_isNamedComponent,
    isComponent: vdom_isComponent,
    hasAttribute: vdom_hasAttribute,

    createEmptyNode: vdom_createEmptyNode,

    mount: vdom_mount,
    appendToReal: vdom_appendToReal,
    prependToReal: vdom_prependToReal,

    Fragment: 69
}

export default VDOM
