import xvrdom_patch from "./patch"
import vrdom_mount from "../VRDOM/mount"
import vrdom_render from "../VRDOM/render/render"

const plugins = new Set()

const XVRDOM = {
    plugins,
    render: vrdom_render,
    mount: vrdom_mount,
    patch: xvrdom_patch,
}

export default XVRDOM