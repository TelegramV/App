import {FrameworkRouter} from "./router"
import VDOM from "./vdom"
import {createComponent} from "./component"

global.VDOM = VDOM

const Router = new FrameworkRouter()

function mount(selector) {
    const $mountElement = document.querySelector(selector)

    if (Router) {
        Router.run($mountElement)
    } else {
        throw new Error("Router is not defined!")
    }
}

export const AppFramework = {
    Router,
    mount,
    createComponent
}

export default AppFramework