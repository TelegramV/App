import {FrameworkRouter} from "./router"
import VRDOM from "./vrdom"

global.VRDOM = VRDOM

/**
 * @type {Set<VRDOMPlugin>}
 */
const Plugins = new Set()

/**
 * @type {Map<string, Component>}
 */
const MountedComponents = new Map()

/**
 * @type {FrameworkRouter}
 */
const Router = new FrameworkRouter()


/**
 * @param {string} selector
 */
function mount(selector) {
    const $mountElement = document.querySelector(selector)

    if (Router) {
        Router.run($mountElement)
    } else {
        throw new Error("Router is not defined!")
    }
}

/**
 * @param {VRDOMPlugin} vRDOMPlugin
 */
function registerPlugin(vRDOMPlugin) {
    Plugins.add(vRDOMPlugin)
}

/**
 * @param {function(FrameworkRouter)} routesRegister
 */
function useRoutes(routesRegister) {
    routesRegister(Router)
}

export const AppFramework = {
    Router,
    MountedComponents,
    Plugins,
    useRoutes,
    mount,
    registerPlugin,
}

global.F = AppFramework

export default AppFramework