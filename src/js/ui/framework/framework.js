import {FrameworkRouter} from "./router"
import {createComponent} from "./component"
import VRDOM from "./vrdom"

global.VRDOM = VRDOM

/**
 * @type {Map<string, Component>}
 */
const mountedComponents = new Map()

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
    mountedComponents,
    mount,
    createComponent
}

global.F = AppFramework

export default AppFramework