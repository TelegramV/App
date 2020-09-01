/*
 * Telegram V
 * Copyright (C) 2020 original authors
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

import diff from "./xdiff"
import type {AE} from "../component/__component_appEventsBuilder"
import VComponent from "../component/VComponent"

class Component extends VComponent{
    __ = {
        stateful: true,
        initialized: false,
        mounted: false,
        destroyed: false,
        isUpdatingItSelf: false,
        isDeletingItself: false,

        /**
         * @type {Map<EventBus, Map<string, Set<function(BusEvent)>>>}
         */
        appEventContexts: new Map(),

        /**
         * @type {Set<number>}
         */
        intervals: new Set(),

        /**
         * @type {Set<number>}
         */
        timeouts: new Set(),
    }

    constructor(config) {
        super(config);
        this.props = config.props;
        this.state = {};
    }

    appEvents(E: AE) {
    }

    render(props) {
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.warn("mounted", this)
    }

    componentDidMount() {
        console.warn("did mount", this)
    }

    componentDidUpdate() {
        console.warn("did update", this)
    }

    componentWillUpdate() {
        console.warn("will update", this)
    }

    componentWillUnmount() {
        console.warn("will unmount", this)
    }

    componentWillMount() {
        console.warn("will mount", this)
    }

    setState(nextState) {
        Object.assign(this.state, nextState);

        this.forceUpdate()
    }


    forceUpdate() {
        this.$el = diff(
            this.$el,
            this.render(this.props, this.state ?? {}, this.globalState),
            true,
        )(this.$el);

        this.componentDidUpdate();
    }
}

export default Component;