import vrdom_deleteInner from "./deleteInner"

const vrdom_delete = ($el: Element, checkComponents: boolean = true) => {

    if (checkComponents) {
        if ($el.__component && !$el.__component.__.isDeletingItself) {
            $el.__component.__delete()
        } else if ($el.nodeType !== Node.TEXT_NODE) {
            vrdom_deleteInner($el)
        }
    }

    $el.remove()
}

export default vrdom_delete