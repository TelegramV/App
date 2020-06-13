/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import VFrameworkRouter from "./Router/VRouter"
import VRDOMPlugin from "./VRDOM/plugin/VRDOMPlugin"
import VRDOMTextInterceptor from "./VRDOM/plugin/VRDOMTextInterceptor"

class Vee {

    latestInstantiatedComponent = 0
    latestInstantiatedRef = 0

    /**
     * @type {Set<VRDOMPlugin>}
     */
    plugins = new Set()

    /**
     * @type {Set<VRDOMTextInterceptor>}
     */
    textInterceptors = new Set()

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

    useInterceptor(interceptor: Class) {
        if (interceptor.prototype instanceof VRDOMTextInterceptor) {
            this.textInterceptors.add(new interceptor(this));
        }
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

export default Vee