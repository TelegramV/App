import {FrameworkRouter} from "./router"
import VDOM from "./vdom"

window.VDOM = VDOM

const Router = new FrameworkRouter()

function mount(selector) {
    const $mountElement = document.querySelector(selector)

    if (Router) {
        Router.run($mountElement)
    }
}

export const AppFramework = {
    Router,
    mount
}
