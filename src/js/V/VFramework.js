import VFrameworkRouter from "./Router/VRouter"
import VRDOM from "./VRDOM/VRDOM"
import VRDOMPlugin from "./VRDOM/plugin/VRDOMPlugin"

/**
 * V Framework - tool for building SPA-like application. Written specially for Telegram V.
 */
class VFramework {

    latestInstantiatedComponent = 0
    latestInstantiatedRef = 0

    /**
     * @type {Set<VRDOMPlugin>}
     */
    plugins = new Set()

    /**
     * @type {VRDOMInterceptor}
     */
    interceptor = undefined

    /**
     * @type {Map<string, VComponent>}
     */
    mountedComponents = new Map()

    /**
     * @type {Map<string, Ref | FragmentRef | ComponentRef>}
     */
    mountedRefs = new Map()

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

    registerPlugin(plugin: Class<VRDOMPlugin>) {
        this.plugins.add(new plugin)
    }

    setInterceptor(interceptor: Class<VRDOMPlugin>) {
        this.interceptor = new interceptor
    }

    /**
     * @param {function(VFrameworkRouter)} routesRegister
     */
    useRoutes(routesRegister) {
        routesRegister(this.router)
    }

    uniqueComponentId() {
        return ++(this.latestInstantiatedComponent)
    }
}


const VF = new VFramework({
    router: new VFrameworkRouter()
})

global.VRDOM = VRDOM
global.VIX = VF

export default VF