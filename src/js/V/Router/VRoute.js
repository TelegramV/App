import VPage from "./VPage"

type VRouteOptions = any

class VRoute {

    path: string
    page: VPage
    options: VRouteOptions

    constructor(path, page, options: VRouteOptions = {}) {
        this.path = path
        this.page = path
        this.options = options
    }
}

export default VRoute