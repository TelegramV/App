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

import FragmentRef from "../ref/FragmentRef"
import ComponentRef from "../ref/ComponentRef"
import ElementRef from "../ref/ElementRef"
import VApp from "../../vapp"
import __component_withDefaultProps from "./__component_withDefaultProps"
import {__component_update_force} from "./__component_update"


// abstract stateless component
class VComponent {
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

    props: any = {};
    slot: any = null;

    _$el: HTMLElement = null;

    set $el($el) {
        this._$el = $el
    }

    get $el() {
        if (this.__.destroyed) {
            console.error("component is already destroyed!", this.constructor.displayName)
        } else if (!this.__.mounted) {
            console.error("component is not mounted!", this.constructor.displayName)
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

    /**
     * @param {AE} E
     */
    appEvents(E) {
    }

    /**
     * @param {RORC} R
     */
    reactive(R) {
    }

    /**
     * @param props
     */
    render(props) {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    /**
     * before patch callback
     *
     * @param nextProps
     * @param nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
    }

    /**
     * after patch callback
     */
    componentDidUpdate() {
    }

    forceUpdate() {
        __component_update_force(this);
    }

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