// /*
//  * Telegram V
//  * Copyright (C) 2020 Davyd Kohut
//  *
//  * This program is free software: you can redistribute it and/or modify
//  * it under the terms of the GNU General Public License as published by
//  * the Free Software Foundation, either version 3 of the License, or
//  * (at your option) any later version.
//  *
//  * This program is distributed in the hope that it will be useful,
//  * but WITHOUT ANY WARRANTY; without even the implied warranty of
//  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  * GNU General Public License for more details.
//  *
//  * You should have received a copy of the GNU General Public License
//  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
//  *
//  */
//
// import {__component_appEventsBuilder} from "./__component_appEventsBuilder";
// import {__state_register_component} from "./__component_state"
// import {throttleWithRAF} from "../../../Utils/func"
//
// export function __component_init(component) {
//     if (!component.__.initialized) {
//         component.init = component.init.bind(component);
//         component.render = component.render.bind(component);
//         component.componentDidMount = component.componentDidMount.bind(component);
//         component.shouldComponentUpdate = component.shouldComponentUpdate.bind(component);
//         component.componentDidUpdate = component.componentDidUpdate.bind(component);
//         component.componentWillUpdate = component.componentWillUpdate.bind(component);
//         component.forceUpdate = throttleWithRAF(component.forceUpdate.bind(component));
//         component.componentWillMount = component.componentWillMount.bind(component);
//
//         component.appEvents = component.appEvents.bind(component);
//
//         component.withInterval = component.withInterval.bind(component);
//         component.withTimeout = component.withTimeout.bind(component);
//         component.clearIntervals = component.clearIntervals.bind(component);
//         component.clearTimeouts = component.clearTimeouts.bind(component);
//
//         if (component.__.stateful) {
//             component.setState = component.setState.bind(component);
//             component.setGlobalState = component.setGlobalState.bind(component);
//
//             if (component.globalState) {
//                 for (const state of Object.values(component.globalState)) {
//                     __state_register_component(state, component);
//                 }
//             }
//
//             if (component.state.__state_shared) {
//                 __state_register_component(component.state, component);
//             }
//         }
//
//         component.init.call(component, component.props);
//
//         component.appEvents(__component_appEventsBuilder(component));
//         // component.reactive(__component_reactiveObjectEventsBuilder(component));
//
//         component.componentWillMount.call(component, component.props);
//
//         component.__.initialized = true;
//     } else {
//         console.warn("BUG: component already initialized")
//     }
// }
//
// export default __component_init