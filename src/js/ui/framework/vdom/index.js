import {vdom_h} from "./h"
import {vdom_jsx} from "./jsx"
import {vdom_render} from "./render"
import {vdom_diff} from "./diff"
import {vdom_mount} from "./mount"
import vdom_diffReal from "./diffReal"
import vdom_patchReal from "./patchReal"

/**
 Simple Virtual DOM

 @author kohutd & tutorials from the net
 */
export const VDOM = {
    h: vdom_h,
    jsx: vdom_jsx,
    render: vdom_render,
    // diff: vdom_diff,
    // diffReal: vdom_diffReal,
    patchReal: vdom_patchReal,
    mount: vdom_mount,
}

export default VDOM
