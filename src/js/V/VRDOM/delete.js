/**
 * (c) Telegram V
 */

import vrdom_deleteInner from "./deleteInner"

const vrdom_delete = ($el: Element) => {
    if ($el.__component) {
        $el.__component.__unmount()
        vrdom_deleteInner($el)
    }

    if ($el.__ref) {
        $el.__ref.unmount()
        $el.__ref = undefined
        vrdom_deleteInner($el)
    } else if ($el.nodeType !== Node.TEXT_NODE) {
        vrdom_deleteInner($el)
    }

    $el.remove()
}

export default vrdom_delete