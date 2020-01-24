import AppFramework from "../../framework"
import VRDOM from "../index"
import {vrdom_deepDeleteRealNodeInnerComponents} from "../patch"

/**
 * @property {Element|Node} $el
 */
class Component {
    constructor(props) {
        this.__ = {
            inited: false,
            mounted: false,
            destroyed: false,
            created: false,
            patchingSelf: false,

            /**
             * @type {Map<string, *>}
             */
            reactiveContexts: new Map(),

            /**
             * @type {Map<EventBus, Map<string, *>>}
             */
            appEventContexts: new Map(),

            reactiveInited: false
        }

        /**
         * 0: reactive events and properties will be initialized after mount
         * 1: reactive events and properties will be initialized during the component init process
         * 2: reactive events and properties will be initialized after create
         * @type {number}
         */
        this.reactiveStrategy = 0 // todo: implement it

        this.identifier = undefined
        this.name = props.name || this.constructor.name
        this.$el = props.$el || undefined
        this.state = props.state || {}
        this.reactive = props.reactive || {}
        /**
         * @type {Set<*>}
         */
        this.appEvents = props.appEvents || new Set()
        this.props = props.props || {}
        this.slot = props.slot

        this.refs = AppFramework.MountedComponents
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

    // mounted event; normally called once per component
    // on this stage `this.$el` is accessible; if not, then report bug
    // always called after `created`
    mounted() {
    }

    // destroy event (not destroyed)
    destroy() {
    }

    // changed reactive property event
    reactiveChanged(key, value) {
    }

    // will be called when selected app event was fired
    eventFired(bus, event) {
    }

    // patch request interceptor; return `false` to decline.
    patch(vNode) {
        return vNode
    }

    // patched event
    patched() {
        //
    }

    __mounted() {
        // if (this.reactiveStrategy === 0) {
        //     this.__initReactive()
        // }
    }

    __created() {
        // if (this.reactiveStrategy === 0) {
        this.__initReactive()
        // }
    }

    // deletes component
    // do not override this if there is no critical reason
    __delete() {
        this.destroy()
        this.__disableReactive()
        this.__deepDeleteInnerComponents()
        AppFramework.MountedComponents.delete(this.identifier)
        this.$el.remove()
    }

    __deepDeleteInnerComponents() {
        vrdom_deepDeleteRealNodeInnerComponents(this.$el)
    }

    // do not override this if there is no critical reason
    __disableReactive() {
        for (const [key, context] of this.__.reactiveContexts) {
            context.offCallback(context.resolve)
        }

        for (const [bus, contexts] of this.__.appEventContexts) {
            for (const [updateType, context] of contexts) {
                context.offCallback(context.resolve)
            }
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
            this.reactiveChanged = this.reactiveChanged.bind(this)
            this.patch = this.patch.bind(this)

            this.__delete = this.__delete.bind(this)
            this.__render = this.__render.bind(this)
            this.__patch = this.__patch.bind(this)
            this.__mounted = this.__mounted.bind(this)

            this.__.inited = true
        }
    }

    __initReactive() {
        if (!this.__.reactiveInited) {
            for (const [key, context] of Object.entries(this.reactive)) {
                console.log(key)
                if (context) {
                    if (context.__rc) {
                        context.resolve = value => this.__resolveReactivePropertyChange(key, value)
                        this.__.reactiveContexts.set(key, context)
                        this.reactive[key] = context.callback(context.resolve)
                    } else {
                        console.error(`not reactive value ${key}`, context)
                    }
                } else {
                    console.error(`not reactive value ${key}`, context)
                }
            }

            for (const context of this.appEvents) {
                if (context.__re) {

                    context.resolve = this.__resolveReactiveEventFired.bind(this)
                    const bus = context.bus
                    const eventType = context.callback(context.resolve)

                    if (!this.__.appEventContexts.has(bus)) {
                        this.__.appEventContexts.set(bus, new Map())
                    }

                    this.__.appEventContexts.get(bus).set(eventType, context)

                } else {
                    console.error(`not reactive event`, context)
                }
            }

            this.__.reactiveInited = true
        }
    }

    __resolveReactivePropertyChange(key, newValue) {
        if (this.__.reactiveContexts.has(key)) {

            const context = this.__.reactiveContexts.get(key)

            if (context.patchOnly) {
                this.reactive[key] = newValue
                this.__patch()
            } else if (context.fireOnly) {
                this.reactive[key] = newValue
                this.reactiveChanged(key, newValue)
            } else {
                this.reactive[key] = newValue
                this.reactiveChanged(key, newValue)
                this.__patch()
            }

        } else {
            console.error("BUG: reactive context was not found!")
        }
    }

    __resolveReactiveEventFired(bus, event) {
        if (this.__.appEventContexts.has(bus)) {

            let eventType = undefined

            if (event.__any) {
                eventType = "*"
            } else {
                eventType = event.type
            }

            const context = this.__.appEventContexts.get(bus).get(eventType)

            if (context) {
                if (context.patchOnly) {
                    this.__patch()
                } else if (context.fireOnly) {
                    this.eventFired(bus, event)
                } else {
                    this.eventFired(bus, event)
                    this.__patch()
                }
            } else {
                console.error("BUG: invalid event!", bus, event)
            }

        } else {
            console.error("BUG: invalid event bus!")
        }
    }
}

export default Component