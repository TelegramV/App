/**
 * Why? I do not know.
 *
 * Note: only `hash` mode works for now.
 *
 * @version undefined
 * @author kohutd
 */
import VRDOM from "../vrdom"
import {VRNode} from "../vrdom/VRNode"
import AppFramework from "../framework"

export class FrameworkRouter {
    constructor(options = {}) {
        this.mode = options.mode || "hash"
        this.hash = options.hash || "#/"

        /**
         * @type {Element|Node|boolean}
         */
        this.$mountElement = options.$mountElement || false

        /**
         * @type {Element|Node|boolean}
         */
        this.$mountElementInner = undefined

        this.mountId = options.mountId || "app"
        this.routes = options.routes || []

        this.activeRoute = {}
        this.middlewares = []
        this.queryChangeHandlers = []
    }

    middleware(handler) {
        this.middlewares.push(handler)
    }

    /**
     * @param path
     * @param name
     * @param page
     */
    route(path, name, page) {
        let route = {
            path: path,
            name: name,
            page: page
        }

        this.routes.push(route)
    }

    onQueryChange(handler) {
        this.queryChangeHandlers.push(handler)
    }

    run($mountElement) {
        if ($mountElement) {
            this.$mountElement = $mountElement
        }

        if (window.location.hash === "") {
            history.replaceState({}, "", this.hash)
        }

        this.renderActive()

        window.addEventListener("hashchange", () => {
            // check if hash path was changed
            // if wasn't then router will not re-render the component
            // if was then it means that query was changed, so we trigger handlers
            if (this.activeRoute && this.activeRoute.route && this.activeRoute.route.path === parseHash(window.location.hash).path) {
                const newQueryParams = parseQuery(parseHash(window.location.hash).queryString)

                // console.log("[router] triggering query change")

                // if (this.diffQueryParams(newQueryParams)) {
                this.queryChangeHandlers.forEach(h => {
                    this.activeRoute.queryParams = newQueryParams
                    h(newQueryParams)
                })
                // }
            } else {
                // console.log("[router] triggering replace")
                // todo: patch tree not delete it
                AppFramework.mountedComponents.forEach(c => {
                    c.__delete()
                })

                this.renderActive()
            }
        })
    }

    push(path, options = {}) {
        let hash = path.startsWith("/") ? path : `/${path}`
        if (options.queryParams) {
            hash += `?${queryParamsToString(options.queryParams)}`
        }
        location.hash = hash
    }

    renderRoute(route) {
        if (route.page.hasOwnProperty("h") && typeof route.page.h === "function") {
            // console.log("[router] rendering new")
            const vNode = route.page.h()

            if (vNode instanceof VRNode) {
                VRDOM.patch(this.$mountElement, vNode)
            } else {
                throw new Error("page first parent cannot be component for some reason")
            }
        }
    }

    diffQueryParams(queryParams) {
        if (Object.keys(queryParams).length !== Object.keys(this.activeRoute.queryParams).length) {
            return false
        }

        for (const [k, v] of Object.entries(queryParams)) {
            if (this.activeRoute.queryParams[k] !== v) {
                return false
            }
        }

        return true
    }

    findRoute(path) {
        return this.routes.find(route => {
            return match(path, route.path)
        })
    }

    back() {
        // todo: implement
    }

    renderActive() {
        const parsedHash = parseHash(window.location.hash)
        let foundRoute = this.findRoute(parsedHash.path)

        if (!foundRoute) {
            foundRoute = {
                page: {
                    h() {
                        return <div><h1>404</h1></div>
                    }
                }
            }
        }

        const routeToActivate = {
            route: foundRoute,
            queryParams: parseQuery(parsedHash.queryString)
        }

        let doNext = false

        this.middlewares.forEach(middleware => {
            const middlewareResult = middleware(routeToActivate)

            if (middlewareResult !== true && middlewareResult.next !== true) {
                return doNext = middlewareResult.doNext
            }
        })

        if (doNext) {
            return doNext()
        }

        this.activeRoute = routeToActivate

        this.renderRoute(foundRoute)
    }
}

export function match(path, nextpath) {
    path = trimByChar(String(path).toLowerCase().trim(), "/")
    nextpath = trimByChar(String(nextpath).toLowerCase().trim(), "/")

    return path === nextpath
}

export function parseHash(hash) {
    const indexOfQuestion = hash.indexOf("?")
    const path = hash.substring(1, indexOfQuestion >= 0 ? indexOfQuestion : hash.length)
    const queryString = indexOfQuestion >= 0 ? hash.substring(indexOfQuestion + 1) : ""

    return {
        path,
        queryString
    }
}

export function queryParamsToString(queryParams) {
    let queryString = ""
    let i = 0
    for (let key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
            if (i === 0) {
                queryString += `${key}=${queryParams[key]}`
            } else {
                queryString += `&${key}=${queryParams[key]}`
            }
        }
        i++
    }
    return queryString
}

export function parseQuery(queryString) {
    const queryParams = {}

    if (!queryString) {
        return queryParams
    }

    queryString.split("&").map(clbkfn => {
        let temp = clbkfn.split("=")
        queryParams[temp[0]] = temp[1] ? temp[1] : ""
    })

    return queryParams
}

/**
 * stolen from stackoverflow
 *
 * @param string
 * @param character
 * @returns {*}
 */
export function trimByChar(string, character) {
    const first = [...string].findIndex(char => char !== character);
    const last = [...string].reverse().findIndex(char => char !== character);
    return string.substring(first, string.length - last);
}
