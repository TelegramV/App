import type {ComponentProps, ComponentState, VComponentMeta, VRAttrs, VRSlot} from "../types/types"
import VF from "../../VFramework"
import vrdom_delete from "../delete"
import VRDOM from "../VRDOM"
import VRNode from "../VRNode"
import type {BusEvent} from "../../../../api/eventBus/EventBus"
import {EventBus} from "../../../../api/eventBus/EventBus"
import {ReactiveObject} from "../../reactive/ReactiveObject"
import type {AE} from "./appEvents"
import {registerAppEvents} from "./appEvents"
import type {RORC} from "./reactive"
import {registerReactive} from "./reactive"
import {VUI} from "../../VUI"


/**
 * Please use this instead of {@link Component}
 *
 * Features:
 * - reactive state
 * - app events
 * - reactive objects
 * - reactive callbacks
 * - refs for nodes, fragments and components
 * - timeouts
 * - intervals
 * - different patching strategies
 */
export class VComponent {

    __: VComponentMeta = {
        inited: false,
        mounted: false,
        destroyed: false,
        created: false,
        isPatchingItself: false,
        isDeletingItself: false,

        /**
         * @type {Map<EventBus, Map<string, function(BusEvent)>>}
         */
        appEventContexts: new Map(),

        /**
         * @type {Map<ReactiveObject, Map<string, function(BusEvent)>>}
         */
        reactiveObjectContexts: new Map(),

        /**
         * @type {Map<string, ReactiveCallbackContext>}
         */
        reactiveCallbackContexts: new Map(),


        /**
         * @type {Map<string, Map<ReactiveObject, Map<string, function(BusEvent)>>>}
         */
        reactiveCallbackObjectContexts: new Map(),


        /**
         * @type {Map<string, Map<EventBus, Map<string, function(BusEvent)>>>}
         */
        reactiveCallbackAppEventContexts: new Map(),

        /**
         * @type {Set<number>}
         */
        intervals: new Set(),

        /**
         * @type {Set<number>}
         */
        timeouts: new Set(),

        /**
         * @type {boolean}
         */
        stateInTransactionMode: false,
    }

    /**
     * Set patching strategy.
     *
     * @see vrdom_patch
     * @see vrdom_fastpatch
     *
     * @type {number}
     */
    patchingStrategy: number = VRDOM.COMPONENT_PATCH_DEFAULT

    /**
     * If `true` then state will be replaced by Proxy.
     *
     * Note that `setState` will call patch event if `false`.
     *
     * @type {boolean}
     */
    useProxyState = true

    /**
     * Component state.
     *
     * Note that the proxy will be created only for `state` object and not for inner.
     *
     * @type {{}}
     */
    state: ComponentState = {}

    /**
     * Reactive callbacks.
     *
     * @see ReactiveCallback
     *
     * @type {{}}
     */
    callbacks = {}

    /**
     * Name of the component.
     */
    name: string

    /**
     * Unique identifier of the component.
     */
    identifier: string

    /**
     * Component's props.
     * @type {{}}
     */
    props: VRAttrs = {}

    /**
     * Content inside the component.
     *
     * @type {undefined}
     */
    slot: VRSlot = undefined

    /**
     * Mounted element.
     */
    _$el: HTMLElement

    constructor(props: ComponentProps) {
        this.name = props.name || this.constructor.name
        this.props = props.props || {}
        this.slot = props.slot
    }

    set $el($el) {
        this._$el = $el
    }

    get $el() {
        if (this.__.destroyed || !this.__.mounted) {
            console.error("component is already destroyed or yet not mounted!")

            return undefined
        }

        return this._$el
    }

    /**
     * @return {VRNode}
     */
    h() {

    }

    /**
     * Do initialization logic here.
     */
    init() {
    }

    /**
     * Component was mounted.
     */
    mounted() {
    }

    /**
     * Component will be deleted.
     */
    destroy() {

    }

    /**
     * Component was patched.
     */
    patched() {

    }

    /**
     * Register application events.
     *
     * @see AppEvents
     *
     * @param {AE} E
     */
    appEvents(E) {

    }

    /**
     * Register reactive objects.
     *
     * @see ReactiveObject
     *
     * @param {RORC} R
     */
    reactive(R) {

    }

    /**
     * ReactiveCallback was changed.
     *
     * @param key
     * @param value
     */
    callbackChanged(key: string, value: any) {
        //
    }

    /**
     * Component will be patched.
     *
     * Return `false` to prevent.
     *
     * @param node
     * @return {VRNode}
     */
    patchRequest(node: VRNode): VRNode | boolean {
        return node
    }

    /**
     * Internal use only.
     */
    __render() {
        this.__init()

        return this.h()
    }

    /**
     * Internal use only.
     */
    __mount($el: HTMLElement) {
        if (this.__.mounted) {
            console.warn("BUG: component was already mounted")
        }

        this.$el = $el
        this.__.mounted = true
        this.mounted()
        VF.plugins.forEach(plugin => plugin.componentMounted(this))
    }

    /**
     * Internal use only.
     */
    __delete() {
        this.__.isDeletingItself = true
        this.destroy()

        this.clearIntervals()
        this.clearTimeouts()

        this.__unregisterReactiveCallbacks()
        this.__unregisterAppEventResolves()
        this.__unregisterReactiveObjectResolves()

        delete this.$el["__component"]
        vrdom_delete(this.$el, this.patchingStrategy === VRDOM.COMPONENT_PATCH_FAST)
        this.$el = undefined
        this.__.destroyed = true
        this.__.mounted = false
        this.__.isDeletingItself = false
        VF.mountedComponents.delete(this.identifier)
    }

    /**
     * Internal use only.
     */
    __patch() {

        if (this.__.mounted) {
            this.__.isPatchingItself = true
            this.__init()

            // todo: recreate props reactiveObjects subscribers (it can still be done manually by using `patchRequest`)

            const rendered = this.__render()

            if (this.patchRequest(rendered)) {
                if (this.patchingStrategy === VRDOM.COMPONENT_PATCH_FAST) {
                    this.$el = VRDOM.fastpatch(this.$el, rendered)
                } else {
                    this.$el = VRDOM.patch(this.$el, rendered)
                }

                this.$el.__component = this

                this.patched()
            }

            this.__.isPatchingItself = false
        } else {
            console.warn("BUG: Component is not mounted")
        }

        return this.$el
    }

    /**
     * Internal use only.
     */
    __init() {

        if (!this.__.inited) {

            this.init = this.init.bind(this)
            this.h = this.h.bind(this)
            this.mounted = this.mounted.bind(this)
            this.destroy = this.destroy.bind(this)
            this.appEvents = this.appEvents.bind(this)
            this.reactive = this.reactive.bind(this)

            this.__render = this.__render.bind(this)
            this.__patch = this.__patch.bind(this)
            this.__mount = this.__mount.bind(this)
            this.__delete = this.__delete.bind(this)

            this.__registerAppEventResolve = this.__registerAppEventResolve.bind(this)
            this.__unregisterAppEventResolves = this.__unregisterAppEventResolves.bind(this)
            this.__unregisterAppEventResolve = this.__unregisterAppEventResolve.bind(this)
            this.__recreateAppEventsResolves = this.__recreateAppEventsResolves.bind(this)

            this.__registerReactiveObjectResolve = this.__registerReactiveObjectResolve.bind(this)
            this.__unregisterReactiveObjectResolves = this.__unregisterReactiveObjectResolves.bind(this)
            this.__unregisterReactiveObjectResolve = this.__unregisterReactiveObjectResolve.bind(this)
            this.__recreateReactiveObjects = this.__recreateReactiveObjects.bind(this)

            this.__registerReactiveCallbacks = this.__registerReactiveCallbacks.bind(this)
            this.__registerReactiveObjectCallbackResolve = this.__registerReactiveObjectCallbackResolve.bind(this)
            this.__unregisterReactiveCallbacks = this.__unregisterReactiveCallbacks.bind(this)

            this.__initState = this.__initState.bind(this)
            this.stateTransaction = this.stateTransaction.bind(this)

            this.withInterval = this.withInterval.bind(this)
            this.withTimeout = this.withTimeout.bind(this)
            this.clearIntervals = this.clearIntervals.bind(this)
            this.clearTimeouts = this.clearTimeouts.bind(this)

            this.init()

            this.__registerReactiveCallbacks()
            this.appEvents(registerAppEvents(this))
            this.reactive(registerReactive(this))

            this.__initState()

            this.__.inited = true
        }
    }


    // AppEvents

    /**
     * Internal use only.
     */
    __registerAppEventResolve(bus: EventBus, type: string, resolve: (event: BusEvent) => any, condition: any) {
        let busContext = this.__.appEventContexts.get(bus)

        if (!busContext) {
            busContext = this.__.appEventContexts.set(bus, new Map()).get(bus)
            busContext.set(type, resolve)
        } else {
            busContext.set(type, resolve)
        }

        if (condition === null) {
            bus.subscribe(type, resolve)
        } else {
            bus.condition(condition, type, resolve)
        }
    }

    /**
     * Internal use only.
     */
    __unregisterAppEventResolves() {
        this.__.appEventContexts.forEach((busContext, bus) => {
            busContext.forEach((resolve, type) => bus.unsubscribe(type, resolve))
        })
    }

    /**
     * Internal use only.
     */
    __unregisterAppEventResolve(bus: EventBus, type: string) {
        let busContext = this.__.appEventContexts.get(bus)

        if (!busContext) {
            console.error("BUG: bus is not registered")
            return
        }

        const resolve = busContext.get(type)

        bus.unsubscribe(type, resolve)
        busContext.delete(type)
    }

    /**
     * Internal use only.
     */
    __recreateAppEventsResolves() {
        this.__unregisterAppEventResolves()

        this.appEvents(registerAppEvents(this))
    }


    // ReactiveObjects

    /**
     * Internal use only.
     */
    __registerReactiveObjectResolve(object: ReactiveObject, type: string, resolve: (event: BusEvent) => any) {
        let reactiveObjectContext = this.__.reactiveObjectContexts.get(object)

        if (!reactiveObjectContext) {
            reactiveObjectContext = this.__.reactiveObjectContexts.set(object, new Map()).get(object)
            reactiveObjectContext.set(type, resolve)
        } else {
            reactiveObjectContext.set(type, resolve)
        }

        object.subscribe(type, resolve)
    }

    /**
     * Internal use only.
     */
    __unregisterReactiveObjectResolves() {
        this.__.reactiveObjectContexts.forEach((reactiveObjectContext, object) => {
            reactiveObjectContext.forEach((resolve, type) => object.unsubscribe(type, resolve))
        })
    }

    /**
     * Internal use only.
     */
    __unregisterReactiveObjectResolve(object: ReactiveObject, type: string) {
        let reactiveObjectContext = this.__.reactiveObjectContexts.get(object)

        if (!reactiveObjectContext) {
            console.error("BUG: reactiveObject is not registered")
            return
        }

        const resolve = reactiveObjectContext.get(type)

        object.unsubscribe(type, resolve)
        reactiveObjectContext.delete(type)
    }

    /**
     * Internal use only.
     */
    __recreateReactiveObjects() {
        this.__unregisterReactiveObjectResolves()

        this.reactive(registerReactive(this))
    }


    // ReactiveCallbacks


    /**
     * Internal use only.
     */
    __registerReactiveCallbacks() {
        for (const [key, context] of Object.entries(this.callbacks)) {
            if (context.__rc) {
                context.subscription = (value) => this.__resolveReactiveCallbackChange(key, value)
                this.__.reactiveCallbackContexts.set(key, context)
                this.callbacks[key] = context.subscribe(context.subscription)
            } else {
                console.error(`not reactive callback ${key}`, context)
            }
        }
    }

    /**
     * Internal use only.
     */
    __unregisterReactiveCallbacks() {
        for (const [key, context] of this.__.reactiveCallbackContexts) {
            if (context.__rc) {
                context.unsubscribe(context.subscription)
            } else {
                console.error(`BUG: invalid context found while disabling reactive callbacks. ${key} = ${context}`)
            }
        }
    }

    /**
     * Internal use only.
     */
    __resolveReactiveCallbackChange(key, value) {

        const context = this.__.reactiveCallbackContexts.get(key)

        if (!context) {
            console.error("BUG: reactive callback context was not found!")
            return
        }

        if (context.patchOnly) {
            this.callbacks[key] = value
            this.__patch()
        } else if (context.fireOnly) {
            this.callbacks[key] = value
            this.callbackChanged(key, value)
        } else {
            this.callbacks[key] = value
            this.callbackChanged(key, value)
            this.__patch()
        }
    }

    /**
     * Internal use only.
     */
    __registerAppEventCallbackResolve(bus: EventBus, type: string, resolve: (event: BusEvent) => any, callbackName: any) {
        let callbackContext = this.__.reactiveCallbackAppEventContexts.get(callbackName)

        if (!callbackContext) {
            callbackContext = this.__.reactiveCallbackContexts.set(bus, new Map()).get(bus)
            callbackContext.set(type, resolve)
        } else {
            callbackContext.set(type, resolve)
        }

        if (condition === null) {
            bus.subscribe(type, resolve)
        } else {
            bus.condition(condition, type, resolve)
        }
    }

    /**
     * Internal use only.
     */
    __registerReactiveObjectCallbackResolve(key: string, type: string, resolve: (event: BusEvent) => any) {
        //
    }


    // State

    /**
     * Internal use only.
     */
    __initState() {
        if (this.useProxyState) {
            this.state = new Proxy(this.state, {
                set: (target: ComponentState, p: string | number, value: any): boolean => {
                    return this.proxyStatePropertyChanged(target, p, value)
                }
            })
        }
    }

    /**
     * Internal use only.
     */
    stateTransaction(resolve, callStateChanged = true) {
        this.__.stateInTransactionMode = true
        resolve.bind(this)(this.state)
        this.__.stateInTransactionMode = false
        if (callStateChanged) {
            this.stateChanged({})
        }
    }

    /**
     * Set state data.
     *
     * @param data
     */
    setState(data) {
        let stateWasChanged = false
        this.__.stateInTransactionMode = true
        for (const [k, v] of Object.entries(data)) {
            if (this.state[k] !== v) {
                this.state[k] = v
                stateWasChanged = true
            }
        }
        this.__.stateInTransactionMode = false
        if (stateWasChanged) {
            this.stateChanged({})
        }
    }

    /**
     * State was changed by proxy.
     * Internal use only. But if there is a need you can override this.
     *
     * @param target
     * @param key
     * @param value
     * @return {boolean}
     */
    proxyStatePropertyChanged(target, key, value) {
        if (target[key] !== value) {
            target[key] = value
            if (!this.__.stateInTransactionMode) {
                this.stateChanged({target, key, value})
            }
            return true
        }

        return false
    }

    /**
     * State was changed.
     *
     * @param target
     * @param key
     * @param value
     */
    stateChanged({target, key, value}) {
        this.__patch()
    }


    // Intervals and Timeouts

    /**
     * Register interval.
     *
     * @param handler
     * @param timeout
     * @param args
     */
    withInterval(handler: TimerHandler, timeout?: number, ...args: any[]) {
        this.__.intervals.add(setInterval(handler, timeout, ...args))
    }

    /**
     * Register timeout.
     *
     * @param handler
     * @param timeout
     * @param args
     */
    withTimeout(handler: TimerHandler, timeout?: number, ...args: any[]) {
        this.__.timeouts.add(setTimeout(handler, timeout, ...args))
    }

    /**
     * Clear all intervals.
     */
    clearIntervals() {
        this.__.intervals.forEach(handle => clearInterval(handle))
        this.__.intervals.clear()
    }

    /**
     * Clear all timeouts.
     */
    clearTimeouts() {
        this.__.timeouts.forEach(handle => clearTimeout(handle))
        this.__.timeouts.clear()
    }

    // ref

    /**
     * Create ref for a simple node.
     */
    static createRef() {
        return {
            __ref: true,
            $el: undefined,
            show() {
                VUI.showElement(this.$el)
            },
            hide() {
                VUI.hideElement(this.$el)
            }
        }
    }

    /**
     * Create ref for a fragment.
     */
    static createFragmentRef() {
        return {
            __fragment_ref: true,
            $el: undefined,
            fragment: undefined,
            props: {},
            slot: undefined,

            // warning: fastpatch by default
            patch(props, fast = false) {
                if (this.$el) {

                    Object.assign(this.props, props)

                    if (fast) {
                        this.$el = VRDOM.fastpatch(this.$el, this.fragment({...this.props, slot: this.slot}))
                    } else {
                        this.$el = VRDOM.patch(this.$el, this.fragment({...this.props, slot: this.slot}))
                    }
                } else {
                    console.log("el not found", this)
                }
            }
        }
    }

    /**
     * Create ref for a component.
     */
    static createComponentRef() {
        return {
            __component_ref: true,
            component: undefined
        }
    }

    /**
     * @param identifier
     * @return {Component | VComponent}
     */
    static getComponentById(identifier) {
        return VF.mountedComponents.get(identifier)
    }
}

export default VComponent