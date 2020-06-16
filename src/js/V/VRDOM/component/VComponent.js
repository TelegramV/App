/*
 * Telegram V
 * Copyright (C) 2020 Davyd Kohut
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import FragmentRef from "../ref/FragmentRef"
import ComponentRef from "../ref/ComponentRef"
import ElementRef from "../ref/ElementRef"
import VApp from "../../vapp"
import __component_withDefaultProps from "./__component_withDefaultProps"
import {__component_update_force} from "./__component_update"
import type {RORC} from "./__component_reactiveObjectEventsBuilder"
import type {AE} from "./__component_appEventsBuilder"
import {debounce, throttle} from "../../../Utils/func"

export class ComponentDidNotMount {
}

export class ComponentWasDestroyed {
}


// abstract stateless component
class VComponent<P> {
    __ = {
        stateful: false,
        initialized: false,
        mounted: false,
        destroyed: false,
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
         * @type {Set<number>}
         */
        intervals: new Set(),

        /**
         * @type {Set<number>}
         */
        timeouts: new Set(),
    }

    static defaultProps: any = null;
    static displayName: string = "VComponent";

    props: P = {};
    slot: any = null;

    _$el: HTMLElement = null;

    set $el($el) {
        this._$el = $el
    }

    get $el() {
        if (this.__.destroyed) {
            console.error("BUG: component is destroyed!", this.constructor.name)
        } else if (!this.__.mounted) {
            console.error("BUG: component is not mounted!", this.constructor.name)
        }

        return this._$el
    }

    constructor(config) {
        this.props = __component_withDefaultProps(this, config.props);
        this.identifier = config.identifier;
        this.slot = config.slot;
    }

    /**
     * Never use here data from props!
     */
    init() {
    }

    appEvents(E: AE) {
    }

    reactive(R: RORC) {
    }

    render(props) {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentWillUpdate(nextProps) {
    }

    shouldComponentUpdate(nextProps) {
    }

    /**
     * after patch callback
     */
    componentDidUpdate() {
    }

    // same as init, but called after init, kostyl..
    componentWillMount(props) {
    }

    forceUpdate() {
        __component_update_force(this);
    }

    /**
     * @deprecated never use it (but sometimes you can)
     * @param nextProps
     */
    updateProps(nextProps) {
        __component_update_force(this, nextProps);
    }

    // Intervals and Timeouts

    /**
     * Register interval.
     *
     * @param handler
     * @param timeout
     * @param args
     */
    withInterval(handler: TimerHandler, timeout?: number, ...args: any[]): number {
        const id = setInterval(handler, timeout, ...args);
        this.__.intervals.add(id);
        return id;
    }

    /**
     * Register timeout.
     *
     * @param handler
     * @param timeout
     * @param args
     */
    withTimeout(handler: TimerHandler, timeout?: number, ...args: any[]): number {
        const id = setTimeout(handler, timeout, ...args);
        this.__.timeouts.add(id);
        return id;
    }

    /**
     * Clear all intervals.
     */
    clearIntervals() {
        this.__.intervals.forEach(handle => clearInterval(handle));
        this.__.intervals.clear();
    }

    /**
     * Clear single interval.
     *
     * @param id
     */
    clearInterval(id) {
        if (this.__.intervals.has(id)) {
            clearInterval(id);
            this.__.intervals.delete(id);
        }
    }

    /**
     * Clear all timeouts.
     */
    clearTimeouts() {
        this.__.timeouts.forEach(handle => clearTimeout(handle));
        this.__.timeouts.clear();
    }

    /**
     * Clear single timeout
     * @param id
     */
    clearTimeout(id) {
        if (this.__.timeouts.has(id)) {
            clearTimeout(id);
            this.__.timeouts.delete(id);
        }
    }

    /**
     * @param promise
     * @return {Promise<*>}
     */
    assure(promise: Promise<any>) {
        return promise.then(_ => {
            if (!this.__.mounted) {
                throw new ComponentDidNotMount()
            } else if (this.__.destroyed) {
                throw new ComponentWasDestroyed()
            }

            return _;
        });
    }

    throttle(callable, period: number) {
        return throttle(callable, period, this)
    }

    debounce(callable, delay: number) {
        return debounce(callable, delay, this)
    }

    /**
     * @param promise
     * @return {Promise<*>}
     */
    assureNotDestroyed(promise: Promise<any>) {
        return promise.then(_ => {
            if (this.__.destroyed) {
                throw new ComponentWasDestroyed()
            }

            return _;
        });
    }

    /**
     * @param promise
     * @return {Promise<*>}
     */
    assureMounted(promise: Promise<any>) {
        return promise.then(_ => {
            if (!this.__.mounted) {
                throw new ComponentDidNotMount()
            }

            return _;
        });
    }

    toString() {
        return `${this.constructor.displayName}#${this.identifier}`
    }

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