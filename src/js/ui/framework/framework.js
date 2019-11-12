import {FrameworkRouter} from "./router"

class Framework {
    constructor(options = {}) {
        this.Router = options.Router || new FrameworkRouter({
            Framework: this
        })
        this.h = options.h || "<router-view></router-view>"
    }

    mount(selector) {
        const element = document.querySelector(selector)
        element.innerHTML = typeof this.h === "function" ? this.h() : this.h

        if (this.Router) {
            this.Router.run()
        }
    }

    registerComponent(tag, component) {
        window.customElements.define(tag, component)
    }
}

export const AppFramework = new Framework({
    // h() {
    //     return `page: <router-view></router-view>`
    // }
})