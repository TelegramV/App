/**
 * (c) Telegram V
 */

import VFrameworkRouter from "./Router/VRouter"
import VRDOM from "./VRDOM/VRDOM"

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
     * @type {Map<string, VComponent>}
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


const VF = new VFramework({
    router: new VFrameworkRouter()
})

global.VRDOM = VRDOM
global.VIX = VF

export default VF