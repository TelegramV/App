import V from "../VFramework"
import vrdom_delete from "./delete"

const vrdom_deleteInner = ($el: Element) => {
    while ($el.firstChild) {

        const $child = $el.firstChild

        if ($child.nodeType !== Node.TEXT_NODE) {
            // $ignore
            if ($child.hasAttribute("data-component-id")) {

                // $ignore
                const rawId = $child.getAttribute("data-component-id")
                const component = V.mountedComponents.get(rawId)

                if (component) {
                    component.__delete()
                } else {
                    // $ignore
                    vrdom_delete($child)
                }

            } else {
                // $ignore
                vrdom_delete($child)
            }
        } else {
            // $ignore
            $child.remove()
        }

    }
}

export default vrdom_deleteInner