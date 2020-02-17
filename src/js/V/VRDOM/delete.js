/**
 * (c) Telegram V
 */

import vrdom_deleteInner from "./deleteInner"

const vrdom_delete = ($el: Element) => {

    if ($el.__component) {
        if (!$el.__component.__.isDeletingItself) {
            $el.__component.__delete()
        } else {
            vrdom_deleteInner($el)
        }
    } else if ($el.nodeType !== Node.TEXT_NODE) {
        vrdom_deleteInner($el)
    }

    $el.remove()
}

export default vrdom_delete