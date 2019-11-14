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

        this.isLockingRender = false

        this.componentId = Math.random()

        /**
         * Define data only if it is really needed
         */
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

    lockRender() {
        this.isLockingRender = true
    }

    unlockRender() {
        this.isLockingRender = false
    }

    continueRender() {
        this.isLockingRender = false
        this.render()
    }

    render() {
        if (!this.isLockingRender) {
            this.forceRender()
        } else {
            console.warn("rendering was locked")
        }
    }

    forceRender() {
        if (this.isLockingRender) {
            console.warn("rendering was locked")
        }

        const vNode = this.h(this)
        if (this.cachedVNode) {
            const patch = VDOM.diff(this.cachedVNode, vNode)
            this.$node = patch(this.$node)
        } else {
            this.$node = VDOM.render(vNode)
        }
        if (this.$node.dataset) {
            this.$node.dataset.componentId = this.componentId
        }
        this.cachedVNode = vNode
    }

    mount() {
        this.$node = VDOM.mount(VDOM.render(this.h(this)), this.$node)
    }
}