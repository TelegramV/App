/**
 * (c) Telegram V
 */

import vrdom_createElement from "./createElement"
import vrdom_jsx from "./jsx/jsx"
import vrdom_render from "./render/render"
import vrdom_mount from "./mount"
import vrdom_delete from "./delete"
import vrdom_patch from "./patch/patch"
import vrdom_append from "./append"
import vrdom_prepend from "./prepend"
import vrdom_deleteInner from "./deleteInner"
import vrdom_patchChildren from "./patch/vrdom_patchChildren"

/**
 * Virtual DOM that operates on Real DOM and does not save previous rendered state. Written specially for Telegram V.
 */
const VRDOM = {
    createElement: vrdom_createElement,
    jsx: vrdom_jsx,
    render: vrdom_render,
    mount: vrdom_mount,
    patch: vrdom_patch,
    patchChildren: vrdom_patchChildren,
    append: vrdom_append,
    prepend: vrdom_prepend,

    delete: vrdom_delete,
    deleteInner: vrdom_deleteInner,

    // TEXTAREA_SET_VALUE: 0,
    // TEXTAREA_SET_INNER_HTML: 1,
    // TEXTAREA_PATCH: 2,

    COMPONENT_PATCH_DEFAULT: 0,
    COMPONENT_PATCH_FAST: 1, // currently is not working

    Fragment: 69
}

export default VRDOM