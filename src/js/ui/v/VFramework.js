import {VFrameworkRouter} from "./router"
import VRDOM from "./vrdom/VRDOM"

/**
 * V Framework - tool for building SPA-like application. Written specially for Telegram V.
 */
class VFramework {

    latestInstantiatedComponent = 0

    /**
     * @type {Set<VRDOMPlugin>}
     */
    plugins = new Set()

    /**
     * @type {Map<string, Component | VComponent>}
     */
    mountedComponents = new Map()

    /**
     * @type {VFrameworkRouter}
     */
    router = undefined

    /**
     * @param {VFrameworkRouter} router
     */
    constructor({router}) {
        this.router = router
    }

    mount(selector) {
        const $mountElement = document.querySelector(selector)

        if (this.router) {
            this.router.run($mountElement)
        } else {
            throw new Error("Router is not defined!")
        }
    }

    registerPlugin(vRDOMPlugin) {
        this.plugins.add(vRDOMPlugin)
    }

    /**
     * @param {function(VFrameworkRouter)} routesRegister
     */
    useRoutes(routesRegister) {
        routesRegister(this.router)
    }
}


const V = new VFramework({
    router: new VFrameworkRouter()
})

global.VRDOM = VRDOM
global.VIX = V

export default V