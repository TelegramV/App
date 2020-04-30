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

import __component_update from "./__component_update";

// wip
// blah blah blah no time sry
class AbstractComponent {
    __ = {
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

    $el: HTMLElement = null;

    constructor(config) {
        this.props = __component_withDefaultProps_wip(this, config.props);
        this.identifier = config.identifier;
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

    /**
     * @param $el
     */
    componentDidMount($el: HTMLElement) {
    }

    componentWillUnmount() {
    }

    /**
     * @param nextProps
     * @param nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
    }

    /**
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    forceUpdate() {
        __component_update(this, {
            isForce: true,
        });
    }

    updateProps(nextProps = {}) {
        Object.assign(this.props, nextProps);
        this.forceUpdate();
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
}

export default AbstractComponent;