import vrdom_createElement from "./createElement"
import vrdom_jsx from "./jsx"
import vrdom_render from "./render"
import vrdom_mount from "./mount"
import vrdom_patch from "./patch"
import vrdom_append from "./appendChild"
import vrdom_prepend from "./prependChild"

/**
 * Virtual DOM that operates on Real DOM and does not save previous rendered state.
 *
 * @author kohutd
 */
const VRDOM = {
    createElement: vrdom_createElement,
    jsx: vrdom_jsx,
    render: vrdom_render,
    mount: vrdom_mount,
    patch: vrdom_patch,
    append: vrdom_append,
    prepend: vrdom_prepend,

    Fragment: 69
}

export default VRDOM