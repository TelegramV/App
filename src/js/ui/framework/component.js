import VDOM from "./vdom"

import ObservableSlim from "observable-slim"

/**
 * Kostyl komponent
 *
 * @author kohutd
 */
export class FrameworkComponent {
    constructor(props = {}) {
        this.cachedVNode = null
        this.$node = null

        if (this.data && typeof this.data === "function") {
            this.reactive = ObservableSlim.create(this.data(), true, changes => {
                this.render()
            })
        }

        this.render()
    }

    get$node() {
        return this.$node
    }

    h() {
        throw new Error("You have to override `h` method.")
    }

    render() {
        const vNode = this.h(this)
        if (this.cachedVNode) {
            const patch = VDOM.diff(this.cachedVNode, vNode)
            this.$node = patch(this.$node)
            // VDOM.mount(VDOM.render(vNode), this.$node)
        } else {
            this.$node = VDOM.render(vNode)
        }
        this.cachedVNode = vNode
    }
}