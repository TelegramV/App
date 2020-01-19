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

    // created event; normally called once per component
    // always called before `mounted`
    created() {
    }

    // changed reactive property event
    changed(key, value) {
    }

    // mounted event; normally called once per component
    // on this stage `this.$el` is accessible; if not, then report bug
    // always called after `created`
    mounted() {
    }

    // destroy event (not destroyed)
    destroy() {
    }

    // patch request interceptor; return `false` to decline.
    patch(vNode) {
        return vNode
    }

    // patched event
    patched() {
        //
    }

    // deletes component
    // do not override this if there is no critical reason
    __delete() {
        this.destroy()
        this.__disableReactive()
        AppFramework.mountedComponents.delete(this.$el.getAttribute("data-component-id"))
        this.$el.remove()
    }

    // do not override this if there is no critical reason
    __disableReactive() {
        for (const [resolve, offCallback] of this.__.reactiveOffCallbacks.values()) {
            offCallback(resolve)
        }
    }

    /**
     * do not override this if there is no critical reason
     *
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

    // do not override this if there is no critical reason
    __patch(props) {
        if (this.__.mounted) {
            this.__.patchingSelf = true
            this.__init()

            const rendered = this.__render(props)

            if (this.patch(rendered)) {
                this.$el = VRDOM.patch(this.$el, rendered)
                this.patched()
            }

            this.__.patchingSelf = false
        } else {
            console.warn("component is not mounted")
        }

        return this.$el
    }

    // do not override this if there is no critical reason
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

export default Component