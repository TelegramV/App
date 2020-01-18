// import vdom_render from "./render"
// import VDOM from "./index"
// import AppFramework from "../framework"
//
// let latestRenderedComponentId = 0
//
// function Component(component) {
//     this.__ = {
//         inited: false,
//         mounted: false,
//         destroyed: false,
//         created: false,
//         reactive: {},
//         patchingSelf: false
//     }
//
//     this.name = component.name
//     this.$el = undefined
//     this.state = component.state
//     this.reactive = component.reactive
//     this.props = component.props
//     this.slot = component.slot
//
//     this.h = (component.h || function () {
//         throw new Error("implement pls")
//     }).bind(this)
//
//     this.created = (component.created || function () {
//     }).bind(this)
//
//     this.changed = (component.changed || function (key, value) {
//     }).bind(this)
//
//     this.mounted = (component.mounted || function () {
//     }).bind(this)
//
//     this.destroy = (component.destroy || function () {
//     }).bind(this)
//
//     this.patch = (component.patch || function (vNode) {
//         return vNode
//     }).bind(this)
//
//     this.__delete = (function () {
//         this.destroy()
//         AppFramework.mountedComponents.delete(this.$el.getAttribute("data-component-id"))
//         this.$el.remove()
//     })
//
//     this.__render = (function (props) {
//         this.__init()
//
//         if (props) {
//             Object.assign(this.props, props)
//         }
//
//         const vNode = this.h(props)
//
//         vNode.component = this
//         vNode.attrs["data-component"] = this.name
//
//         return vNode
//     }).bind(this)
//
//
//     // ...
//     this.__patch = (function (props) {
//         if (!this.__.patchingSelf) {
//             this.__.patchingSelf = true
//             this.__init()
//
//             if (this.patch(this.__render(props))) {
//                 this.$el = VDOM.patchReal(this.$el, this.__render(props))
//             }
//         }
//
//         this.__.patchingSelf = false
//
//         return this.$el
//     }).bind(this)
//
//     // ...
//     this.__init = (function () {
//         if (!this.__.inited) {
//             for (const [key, value] of Object.entries(this)) {
//                 if (typeof value === "function") {
//                     this[key] = value.bind(this)
//                 }
//             }
//
//             for (const [k, v] of Object.entries(this.reactive)) {
//                 if (v && v.__rc) {
//                     v.component = this
//                     v.key = k
//                     this.reactive[k] = v.defaultValue
//                 } else {
//                     console.error(`not reactive value ${k}`, v)
//                 }
//             }
//
//             this.__.inited = true
//         }
//     }).bind(this)
// }
//
// function vdom_renderNamedComponent(component) {
//     const newComponent = new Component(component)
//
//     newComponent.__init()
//
//     const vComponentElem = newComponent.__render()
//
//     vComponentElem.attrs["data-component-id"] = `${latestRenderedComponentId++}`
//
//     F.mountedComponents.set(vComponentElem.attrs["data-component-id"], newComponent)
//
//     return vdom_render(vComponentElem)
// }
//
// export default vdom_renderNamedComponent