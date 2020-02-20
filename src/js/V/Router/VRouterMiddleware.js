type VRouterMiddlewareResponse = boolean | {
    next: VRoute
}

class VRouterMiddleware {

    /**
     * @param nextRoute
     * @return {VRouterMiddlewareResponse}
     */
    process(nextRoute) {
        //
    }
}

export default VRouterMiddleware