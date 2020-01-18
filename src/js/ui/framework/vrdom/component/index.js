import AppFramework from "../../framework"
import VRDOM from "../index"

class Component {
    constructor(props = {}) {
        this.__ = {
            inited: false,
            mounted: false,
            destroyed: false,
            created: false,
            reactiveOffCallbacks: new Map(),
            patchingSelf: false
        }
        this.identifier = undefined
        this.name = props.name || this.constructor.name
        this.$el = props.$el || undefined
        this.state = props.state || {}
        this.reactive = props.reactive || {}
        this.methods = props.methods || {}
        this.props = {}
        this.slot = props.slot

        this.refs = AppFramework.mountedComponents
    }

    /**
     * @return {VRNode|ComponentVRNode}
     */
    h() {
        throw new Error("implement pls")
    }

    created() {
    }

    changed(key, value) {
    }

    mounted() {
    }

    destroy() {
    }

    patch(vNode) {
        return vNode
    }

    __delete() {
        this.destroy()
        this.__disableReactive()
        AppFramework.mountedComponents.delete(this.$el.getAttribute("data-component-id"))
        this.$el.remove()
    }

    __disableReactive() {
        for (const [resolve, offCallback] of this.__.reactiveOffCallbacks.values()) {
            offCallback(resolve)
        }
    }

    /**
     * @param props
     * @private
     * @return {VRNode}
     */
    __render(props) {
        this.__init()

        if (props) {
            Object.assign(this.props, props)
        }

        const vNode = this.h(props)

        vNode.component = this
        vNode.attrs["data-component"] = this.name

        return vNode
    }

    __patch(props) {
        if (this.__.mounted) {
            this.__.patchingSelf = true
            this.__init()

            const rendered = this.__render(props)

            if (this.patch(rendered)) {
                this.$el = VRDOM.patch(this.$el, rendered)
            }

            this.__.patchingSelf = false
        } else {
            console.warn("component is not mounted")
        }

        return this.$el
    }

    __init() {
        if (!this.__.inited) {
            for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
                if (typeof this[key] === "function") {
                    this[key] = this[key].bind(this)
                }
            }

            this.h = this.h.bind(this)
            this.created = this.created.bind(this)
            this.mounted = this.mounted.bind(this)
            this.changed = this.changed.bind(this)
            this.patch = this.patch.bind(this)

            this.__delete = this.__delete.bind(this)
            this.__render = this.__render.bind(this)
            this.__patch = this.__patch.bind(this)

            for (const [k, v] of Object.entries(this.reactive)) {
                if (v && v.__rc) {
                    v.component = this
                    v.key = k
                    this.reactive[k] = v.defaultValue
                    this.__.reactiveOffCallbacks.set(k, [v.resolve, v.offCallback])
                } else {
                    console.error(`not reactive value ${k}`, v)
                }
            }

            this.__.inited = true
        }
    }
}

// function Component(props) {
//     this.__ = {
//         inited: false,
//         mounted: false,
//         destroyed: false,
//         created: false,
//         reactive: {},
//         patchingSelf: false
//     }
//
//     this.name = this.prototype.name
//     this.$el = undefined
//     this.state = props.state
//     this.reactive = props.reactive
//     this.props = props.props
//     this.methods = props.methods
//     this.slot = props.slot
//
//     /**
//      * @return VNode
//      */
//     this.h = (props.h || function () {
//         throw new Error("implement pls")
//     }).bind(this)
//
//     this.created = (props.created || function () {
//     }).bind(this)
//
//     this.changed = (props.changed || function (key, value) {
//     }).bind(this)
//
//     this.mounted = (props.mounted || function () {
//     }).bind(this)
//
//     this.destroy = (props.destroy || function () {
//     }).bind(this)
//
//     this.patch = (props.patch || function (vNode) {
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
//         if (this.__.mounted) {
//             this.__.patchingSelf = true
//             this.__init()
//
//             if (this.patch(this.__render(props))) {
//                 this.$el = VRDOM.patch(this.$el, this.__render(props))
//             }
//
//             this.__.patchingSelf = false
//         } else {
//             console.warn("component is not mounted")
//         }
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

export default Component