import {FrameworkRouter} from "./router"
import VDOM from "./vdom"

class Framework {
    constructor(options = {}) {
        this.Router = options.Router || new FrameworkRouter({
            Framework: this
        })
        this.h = options.h || VDOM.h("router-view")
    }

    mount(selector) {
        const $mountElement = document.querySelector(selector)

        const $node = typeof this.h === "function" ? VDOM.render(this.h()) : VDOM.render(this.h)
        $mountElement.innerHTML = ""
        $mountElement.appendChild($node)

        if (this.Router) {
            this.Router.run()
        }
    }

    registerComponent(tag, component, options = {}) {
        window.customElements.define(tag, component, Object.assign({}, options))
    }
}

export const AppFramework = new Framework()