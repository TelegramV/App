/**
 * Why? I do not know.
 *
 * Note: only `hash` mode works for now.
 *
 * @version undefined
 * @author kohutd
 */
import VDOM from "../vdom"

class RouterViewHTMLElement extends HTMLElement {
    constructor() {
        super();
    }
}

export class FrameworkRouter {
    constructor(options = {}) {
        if (!options.Framework) {
            throw new Error("Framework is not defined")
        }

        this.Framework = options.Framework

        this.mode = options.mode || "hash"
        this.hash = options.hash || "#/"

        this.mountId = options.mountId || "app"
        this.routes = options.routes || []

        this.Framework.registerComponent("router-view", RouterViewHTMLElement)
        this.routerView = document.getElementsByTagName("router-view").item(0) || false

        this.activeRoute = {}
        this.middlewares = []
        this.queryChangeHandlers = []
    }

    middleware(handler) {
        this.middlewares.push(handler)
    }


    /**
     * WARNING: for some reason do not pass component as an object of HTMLElement! I have to fix it later.
     *
     * @param path
     * @param component
     */
    route(path, name, component) {
        let route = undefined

        if (typeof path === "object") {
            route = path
            route.name = route.name || route.path
        } else {
            route = {
                path: path,
                name: name,
                component: component
            }
        }

        this.routes.push(route)
    }

    onQueryChange(handler) {
        this.queryChangeHandlers.push(handler)
    }

    run() {
        if (window.location.hash === "") {
            history.replaceState({}, "", this.hash);
        }

        this.renderActive()

        window.addEventListener("hashchange", () => {
            // check if hash path changes
            // if doesn't then router will not re-render the component
            // if does then it means that query changes, so we trigger handlers
            if (this.activeRoute.route.path === parseHash(window.location.hash).path) {
                this.queryChangeHandlers.forEach(h => {
                    const newQueryParams = parseQuery(parseHash(window.location.hash).queryString)
                    this.activeRoute.queryParams = newQueryParams
                    h(newQueryParams)
                })
                return
            }

            this.renderActive()
        })
    }

    push(path, options = {}) {
        let hash = path.startsWith("/") ? path : `/${path}`
        if (options.queryParams) {
            hash += `?${queryParamsToString(options.queryParams)}`
        }
        window.location.hash = hash
    }

    renderRoute(route) {
        if (!this.routerView) {
            this.routerView = document.getElementsByTagName("router-view").item(0)
        }

        if (!this.routerView) {
            throw new Error("<router-view> wasn't found")
        }

        if (route.component.hasOwnProperty("render") && typeof route.component.render === "function") {
            this.routerView.innerHTML = route.component.render()
        } else {
            this.routerView.innerHTML = ""
            this.routerView.appendChild(VDOM.render(route.component))
        }

        if (route.component.hasOwnProperty("mounted") && typeof route.component.mounted === "function") {
            route.component.mounted()
        }
    }

    findRoute(path) {
        console.log(path)

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
                component: {
                    render() {
                        return `
                            <h1>404</h1>
                        `
                    }
                }
            }
        }

        const routeToActivate = {
            route: foundRoute,
            queryParams: parseQuery(parsedHash.queryString)
        }

        this.middlewares.forEach(midleware => {
            const middlewareResult = midleware(routeToActivate)

            if (middlewareResult != true && middlewareResult.next != true) {
                return middlewareResult.doNext()
            }
        })

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