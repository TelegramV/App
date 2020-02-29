/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import type {ComponentState, VComponentMeta, VComponentProps, VRAttrs, VRSlot} from "../types/types"
import VRDOM from "../VRDOM"
import type {BusEvent} from "../../../Api/EventBus/EventBus"
import {EventBus} from "../../../Api/EventBus/EventBus"
import {ReactiveObject} from "../../Reactive/ReactiveObject"
import type {AE} from "./__component_registerAppEvents"
import {__component_registerAppEvents} from "./__component_registerAppEvents"
import type {RORC} from "./__component_registerReactive"
import {__component_registerReactive} from "./__component_registerReactive"
import __component_update from "./__component_update"
import __component_unmount from "./__component_unmount"
import __component_mount from "./__component_mount"
import __component_init from "./__component_init"
import __component_withDefaultProps from "./__component_withDefaultProps"
import FragmentRef from "../ref/FragmentRef"
import ComponentRef from "../ref/ComponentRef"
import ElementRef from "../ref/ElementRef"
import VApp from "../../../vapp"

/**
 * Features:
 * - reactive state
 * - app events
 * - reactive objects
 * - reactive callbacks
 * - refs for $elements, fragments and components
 * - timeouts
 * - intervals
 */
class VComponent {

    __: VComponentMeta = {
        inited: false,
        mounted: false,
        destroyed: false,
        created: false,
        isUpdatingItSelf: false,
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
    }

    singleton: boolean = false

    /**
     * Default component props:
     *
     * Example:
     * class SomeComponent extends VComponent {
     *     render() {
     *         return <h1>{this.props.header}</h1>
     *     }
     * }
     *
     * SomeComponent.defaultProps = {
     *     header: "Wow!"
     * }
     *
     * @type {undefined}
     */
    static defaultProps = undefined

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
     * @deprecated
     */
    callbacks = {}

    /**
     * Name of the component.
     *
     * @deprecated
     */
    name: string

    /**
     * Name of the component.
     */
    displayName: string

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

    constructor(props: VComponentProps) {
        this.displayName = props.displayName || this.constructor.name
        this.slot = props.slot
        this.props = __component_withDefaultProps(this, props.props)
        this.v = props.v
        this.identifier = props.identifier

        if (this.singleton) {
            this.identifier = this.displayName
        }
    }

    set $el($el) {
        this._$el = $el
    }

    get $el() {
        if (this.__.destroyed) {
            console.error("component is already destroyed!", this.displayName)
        } else if (!this.__.mounted) {
            console.error("component is not mounted!", this.displayName)
        }

        return this._$el
    }

    /**
     * Do initialization logic here.
     */
    init() {
    }

    /**
     * WARNING: if you need to manually render a component, then DO NOT USE THIS METHOD, use {@link __render} instead.
     */
    render() {
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    shouldComponentUpdate(nextProps, nextState) {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

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
     * Internal use only.
     */
    __render() {
        const renderedVRNode = this.render()
        renderedVRNode.component = this
        return renderedVRNode
    }

    /**
     * Internal use only.
     */
    __mount($el: HTMLElement) {
        return __component_mount(this, $el)
    }

    /**
     * Internal use only.
     */
    __unmount() {
        return __component_unmount(this)
    }

    /**
     * Internal use only.
     */
    __destroy() {
        return VRDOM.delete(this.$el)
    }

    /**
     * Internal use only.
     */
    __init() {
        return __component_init(this)
    }

    // AppEvents

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

        this.appEvents(__component_registerAppEvents(this))
    }


    // ReactiveObjects

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

        this.reactive(__component_registerReactive(this))
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
            this.forceUpdate()
        } else if (context.fireOnly) {
            this.callbacks[key] = value
            this.callbackChanged(key, value)
        } else {
            this.callbacks[key] = value
            this.callbackChanged(key, value)
            this.forceUpdate()
        }
    }

    /**
     * Internal use only.
     */
    __registerAppEventCallbackResolve(bus: EventBus, type: string, resolve: (event: BusEvent) => any, callbackName: any) {

    }

    /**
     * Internal use only.
     */
    __registerReactiveObjectCallbackResolve(key: string, type: string, resolve: (event: BusEvent) => any) {
        //
    }

    /**
     * Set state data.
     *
     * @param nextState
     */
    setState(nextState) {
        if (typeof nextState === "function") {
            this.__update({
                nextState: nextState(this.state)
            })
        } else {
            this.__update({
                nextState
            })
        }
    }

    forceUpdate() {
        this.__update({
            isForce: true
        })
    }

    __update(props) {
        return __component_update(this, props)
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

    // other

    toString() {
        return this.identifier
    }

    // ref

    /**
     * Create ref for a simple node.
     */
    static createRef() {
        return new ElementRef()
    }

    /**
     * Create ref for a fragment.
     * @return {FragmentRef}
     */
    static createFragmentRef() {
        return new FragmentRef()
    }

    /**
     * Create ref for a component.
     */
    static createComponentRef() {
        return new ComponentRef()
    }

    /**
     * @param identifier
     * @return {VComponent}
     */
    static getComponentById(identifier) {
        return VApp.mountedComponents.get(identifier)
    }
}

export default VComponent