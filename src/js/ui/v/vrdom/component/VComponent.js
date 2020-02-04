import type {ComponentProps, ComponentState, VComponentMeta, VRAttrs, VRSlot} from "../types/types"
import V from "../../VFramework"
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


/**
 * Use this instead of {@link Component}
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

    patchingStrategy: number = VRDOM.COMPONENT_PATCH_DEFAULT

    useProxyState = true
    state: ComponentState = {}
    callbacks = {}

    name: string
    identifier: string
    props: VRAttrs = {}
    slot: VRSlot = undefined

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

    h() {
        return 69
    }

    init() {
    }

    mounted() {
    }

    destroy() {

    }

    patched() {

    }

    /**
     * do not call this thing manually
     *
     * @param {AE} E
     */
    appEvents(E) {

    }

    /**
     * do not call this thing manually
     *
     * @param {RORC} R
     */
    reactive(R) {

    }

    callbackChanged(key: string, value: any) {
        //
    }

    patchRequest(node: VRNode): VRNode | boolean {
        return node
    }


    __render() {
        this.__init()

        return this.h()
    }

    __mount($el: HTMLElement) {
        if (this.__.mounted) {
            console.warn("BUG: component was already mounted")
        }

        this.$el = $el
        this.__.mounted = true
        this.mounted()
        V.plugins.forEach(plugin => plugin.componentMounted(this))
    }

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
        V.mountedComponents.delete(this.identifier)
    }

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

    __unregisterAppEventResolves() {
        this.__.appEventContexts.forEach((busContext, bus) => {
            busContext.forEach((resolve, type) => bus.unsubscribe(type, resolve))
        })
    }

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

    __recreateAppEventsResolves() {
        this.__unregisterAppEventResolves()

        this.appEvents(registerAppEvents(this))
    }


    // ReactiveObjects

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


    __unregisterReactiveObjectResolves() {
        this.__.reactiveObjectContexts.forEach((reactiveObjectContext, object) => {
            reactiveObjectContext.forEach((resolve, type) => object.unsubscribe(type, resolve))
        })
    }

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

    __recreateReactiveObjects() {
        this.__unregisterReactiveObjectResolves()

        this.reactive(registerReactive(this))
    }


    // ReactiveCallbacks


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

    __unregisterReactiveCallbacks() {
        for (const [key, context] of this.__.reactiveCallbackContexts) {
            if (context.__rc) {
                context.unsubscribe(context.subscription)
            } else {
                console.error(`BUG: invalid context found while disabling reactive callbacks. ${key} = ${context}`)
            }
        }
    }

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

    __registerReactiveObjectCallbackResolve(key: string, type: string, resolve: (event: BusEvent) => any) {
        //
    }


    // State

    __initState() {
        if (this.useProxyState) {
            this.state = new Proxy(this.state, {
                set: (target: ComponentState, p: string | number, value: any): boolean => {
                    return this.proxyStatePropertyChanged(target, p, value)
                }
            })
        }
    }

    stateTransaction(resolve) {
        this.__.stateInTransactionMode = true
        resolve.bind(this)(this.state)
        this.__.stateInTransactionMode = false
        this.stateChanged()
    }

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
            this.stateChanged()
        }
    }

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

    stateChanged({target, key, value}) {
        this.__patch()
    }


    // Intervals and Timeouts

    withInterval(handler: TimerHandler, timeout?: number, ...args: any[]) {
        this.__.intervals.add(setInterval(handler, timeout, ...args))
    }

    withTimeout(handler: TimerHandler, timeout?: number, ...args: any[]) {
        this.__.timeouts.add(setTimeout(handler, timeout, ...args))
    }

    clearIntervals() {
        this.__.intervals.forEach(handle => clearInterval(handle))
    }

    clearTimeouts() {
        this.__.timeouts.forEach(handle => clearTimeout(handle))
    }

    // ref

    static createRef() {
        return {
            __ref: true,
            $el: undefined,
        }
    }

    static createFragmentRef() {
        return {
            __fragment_ref: true,
            $el: undefined,
            fragment: undefined,
            props: {},
            slot: undefined,

            // warning: fastpatch by default
            patch(props, fast = true) {
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

    static createComponentRef() {
        return {
            __component_ref: true,
            component: undefined
        }
    }
}