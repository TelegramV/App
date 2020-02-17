/**
 * (c) Telegram V
 */

import vrdom_delete from "./delete"

const vrdom_deleteInner = ($el: Element) => {
    while ($el.firstChild) {

        vrdom_delete($el.firstChild)

    }
}

export default vrdom_deleteInner