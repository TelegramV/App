/**
 * (c) Telegram V
 */

import vrdom_deleteInner from "./deleteInner"

const vrdom_delete = ($el: Element) => {
    if ($el.nodeType !== Node.TEXT_NODE) {
        if ($el.__component) {
            $el.__component.__unmount()
            $el.__component = undefined
        } else if ($el.__list) {
            $el.__list.__unmount()
            $el.__list = undefined
        }

        if ($el.__ref) {
            $el.__ref.unmount()
            $el.__ref = undefined
        }

        vrdom_deleteInner($el)
    }

    $el.remove()
}

export default vrdom_delete