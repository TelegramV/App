import vrdom_deleteInner from "./deleteInner"

const vrdom_delete = ($el: Element) => {
    vrdom_deleteInner($el)
    $el.remove()
}

export default vrdom_delete