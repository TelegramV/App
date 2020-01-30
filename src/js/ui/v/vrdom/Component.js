//
// WARNING: Flow JS supports only React.
//          DO NOT USE FlOW JS WITH COMPONENTS
//

import type {BusEvent} from "../../../api/eventBus/EventBus"
import {EventBus} from "../../../api/eventBus/EventBus"
import V from "../VFramework"
import {ReactiveObject} from "../reactive/ReactiveObject"
import type {
    ComponentMeta,
    ComponentProps,
    ComponentReactiveState,
    ComponentState,
    VRAttrs,
    VRSlot
} from "./types/types"
import VRNode from "./VRNode"
import vrdom_delete from "./delete"
import VRDOM from "./VRDOM"

/**
 * V Component
 */
class Component {
    __: ComponentMeta = Object.assign(Object.create(null), {
        inited: false,
        mounted: false,
        destroyed: false,
        created: false,
        isPatchingItself: false,

        reactiveContexts: new Map(),

        appEventContexts: new Map(),

        reactiveInited: false
    })

    /**
     * Component's name
     */
    name: string = this.constructor.name

    /**
     * Unique component's id
     */
    identifier: string

    /**
     * Real DOM Element with which component is associated.
     *
     * If not present then there is a good reason to delete component completely by using `__delete`
     */
    $el: HTMLElement

    /**
     * @deprecated
     */
    $elements: Map<string, Element> = new Map()

    /**
     * Component's non-reactive state.
     */
    state: ComponentState = {}

    /**
     * Component's reactive state.
     *
     * @see ReactiveCallback
     * @see ReactiveObject
     */
    reactive: ComponentReactiveState = {}

    /**
     * AppEvents that component is listening.
     *
     * @see AppEventBus
     * @see ReactiveEvent
     */
    appEvents: Set<any> = new Set()

    /**
     * Component's props passed by arguments.
     */
    props: VRAttrs = {}

    /**
     * Component's slot.
     */
    slot: VRSlot = undefined

    /**
     * List of mounted components.
     */
    refs: Map<string, Component> = V.mountedComponents

    constructor(props: ComponentProps) {
        this.name = props.name || this.constructor.name
        this.$el = props.$el || undefined
        this.state = props.state || {}
        this.reactive = props.reactive || {}
        this.appEvents = props.appEvents || new Set()
        this.props = props.props || {}
        this.slot = props.slot
        this.refs = V.mountedComponents
    }


    /**
     * Do initialization logic here
     */
    init() {
    }

    /**
     * Render VRNode
     */
    h(): VRNode {
        throw new Error("implement pls")
    }

    /**
     * Created hook.
     * Will be called after children appending.
     */
    created() {
    }

    /**
     * Mounted hook.
     * Will be called after mounting to Real DOM.
     */
    mounted() {
    }

    /**
     * Destroying hook.
     * Will be called before component deleting.
     */
    destroy() {
    }

    /**
     * Patched hook.
     * Will be called after component was patched. (__patched was called)
     */
    patched() {
    }

    /**
     * Some reactive property was changed.
     *
     * @see ReactiveCallback
     * @see ReactiveObject
     *
     * @param key
     * @param value
     * @param event
     */
    reactiveChanged(key: string, value: any, event: BusEvent) {
    }

    /**
     * AppEvent was fired.
     *
     * @see AppEvents
     *
     * @param bus
     * @param event
     */
    eventFired(bus: EventBus, event: BusEvent) {
    }

    // do not override this if there is no critical reason
    __init() {
        if (!this.__.inited) {

            for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
                // $FlowIssue
                if (typeof this[key] === "function") {
                    // $FlowIssue
                    this[key] = this[key].bind(this)
                }
            }

            this.init()

            this.__initReactive()

            this.__.inited = true
        }
    }

    __render() {
        this.__init()

        const node = this.h()

        node.attrs["data-component"] = this.name

        return node
    }

    // do not use this
    __mount() {
    }

    // deletes component completely
    // do not override this if there is no critical reason
    __delete() {
        this.destroy()
        this.__disableReactive()
        vrdom_delete(this.$el)
        V.mountedComponents.delete(this.identifier)
    }

    patchRequest(node: VRNode) {
        return node
    }

    // use this to manually patch component
    // do not override this if there is no critical reason
    __patch() {
        if (this.__.mounted) {
            this.__.isPatchingItself = true
            this.__init()

            const rendered = this.__render()

            if (this.patchRequest(rendered)) {
                this.$el = VRDOM.patch(this.$el, rendered)
                this.patched()
            }

            this.__.isPatchingItself = false
        } else {
            console.warn("component is not mounted")
        }

        return this.$el
    }

    // do not use this
    __mounted() {

    }

    // do not use this
    __created() {
    }

    /* REACTIVE SECTION */

    __initReactive() {
        if (!this.__.reactiveInited) {
            for (const [key, context] of Object.entries(this.reactive)) {
                if (context) {
                    if (context instanceof ReactiveObject) {
                        const newContext = Object.create(null)
                        newContext.__obj = true
                        newContext.resolve = (value, event) => this.__resolveReactivePropertyChange(key, value, event)
                        this.__.reactiveContexts.set(key, newContext)
                        context.subscribeAny(newContext.resolve)
                    } else if (context.__rc) {
                        console.warn("avoid using reactive callbacks, use reactive objects instead")
                        // $FlowIssue
                        context.subscription = (value, event) => this.__resolveReactivePropertyChange(key, value, event)
                        this.__.reactiveContexts.set(key, context)
                        // $FlowIssue
                        this.reactive[key] = context.subscribe(context.subscription)
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

                    //$FlowIssue
                    this.__.appEventContexts.get(bus).set(eventType, context)

                } else {
                    console.error(`not reactive event`, context)
                }
            }

            this.__.reactiveInited = true
        }
    }

    __disableReactive() {
        for (const [key, context] of this.__.reactiveContexts) {
            if (context.__obj) {
                if (this.reactive[key] instanceof ReactiveObject) {
                    this.reactive[key].unsubscribe(context.resolve)
                } else {
                    console.error(`BUG: invalid reactive property found while disabling reactive properties. ${key} = ${this.reactive[key]}`)
                }
            } else {
                context.unsubscribe(context.subscription)
            }
        }

        for (const [bus, contexts] of this.__.appEventContexts) {
            for (const [updateType, context] of contexts) {
                context.offCallback(context.resolve)
            }
        }
    }

    __resolveReactivePropertyChange(key: any, newValue: any, event: any) {
        if (this.__.reactiveContexts.has(key)) {

            const context = this.__.reactiveContexts.get(key)

            // $FlowIssue
            if (context.__obj) {
                this.reactiveChanged(key, newValue, event)
            } else {
                // $FlowIssue
                if (context.patchOnly) {
                    this.reactive[key] = newValue
                    this.__patch()
                    // $FlowIssue
                } else if (context.fireOnly) {
                    this.reactive[key] = newValue
                    this.reactiveChanged(key, newValue, event)
                } else {
                    this.reactive[key] = newValue
                    this.reactiveChanged(key, newValue, event)
                    this.__patch()
                }
            }

        } else {
            console.error("BUG: reactive context was not found!")
        }
    }

    __resolveReactiveEventFired(bus: EventBus, event: any) {
        if (this.__.appEventContexts.has(bus)) {

            let eventType = undefined

            if (event.__any) {
                eventType = "*"
            } else {
                eventType = event.type
            }

            // $FlowIssue
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