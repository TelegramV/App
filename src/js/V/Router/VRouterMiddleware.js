import VRoute from "./VRoute"

// return VRoute to show next route, `false` to stay at previous or `404` to show 404 page error
type VRouterMiddlewareResponse = boolean | VRoute

class VRouterMiddleware {

    /**
     * @param nextRoute
     * @return {VRouterMiddlewareResponse}
     */
    process(nextRoute: VRoute): VRouterMiddlewareResponse {
        //
    }
}

export default VRouterMiddleware