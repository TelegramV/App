import VDOM from "./vdom"

import ObservableSlim from "observable-slim"

/**
 * Kostyl komponent
 *
 * @author kohutd
 */
export class FrameworkComponent {
    constructor(props = {}) {
        /**
         * Define data only if it is really needed
         */
        if (this.data && typeof this.data === "function") {
            this.reactive = ObservableSlim.create(this.data(), true, changes => {
                this.render()
            })
        }

        this.count = 0
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

    mounted() {
        //
    }

    updated() {
        //
    }

    /** render functions defines in {@link VDOM.render} */
    render() {
        console.warn("this component cannot be rendered")
        // throw new Error("this component cannot be rendered")
    }
}
