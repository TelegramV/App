import {FrameworkRouter} from "./router"
import VDOM from "./vdom"

class Framework {
    constructor(options = {}) {
        this.Router = options.Router || new FrameworkRouter({
            Framework: this
        })
        this.h = options.h || (() => <h1>...</h1>)
        window.VDOM = VDOM
    }

    mount(selector) {
        const $mountElement = document.querySelector(selector)

        if (this.Router) {
            this.Router.run($mountElement)
        }
    }

    registerComponent(tag, component, options = {}) {
        // window.customElements.define(tag, component, Object.assign({}, options))
    }
}

export const AppFramework = new Framework()