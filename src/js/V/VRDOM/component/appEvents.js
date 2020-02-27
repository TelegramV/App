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

import {EventBus} from "../../../Api/EventBus/EventBus"
import VComponent from "./VComponent"


// types

export type AESubscribe = {
    on(type: string, resolve: any): AESubscribe
}

export type AECondition = AESubscribe | {
    /**
     * @deprecated use `constraint` instead
     */
    condition(condition: any): AESubscribe,
    constraint(constraint: any): AESubscribe,
}

export type AE = {
    bus(bus: EventBus): AECondition
}


// functions

export function registerAppEvents(component: VComponent): AE {
    return {
        bus: (bus: EventBus) => registerAppEvents_bus(component, bus)
    }
}

function registerAppEvents_bus(component: VComponent, bus: EventBus) {
    return {
        condition: (condition: any) => registerAppEvents_bus_constraint(component, bus, condition),
        constraint: (constraint: any) => registerAppEvents_bus_constraint(component, bus, constraint),
        on: (type: string, resolve: any) => registerAppEvents_bus_condition_subscribe(component, bus, null, type, resolve)
    }
}

function registerAppEvents_bus_constraint(component: VComponent, bus: EventBus, condition: any) {
    console.warn("Deprecated usage: use `constraint` instead of `condition`")

    return {
        on: (type: string, resolve: any) => registerAppEvents_bus_condition_subscribe(component, bus, condition, type, resolve)
    }
}

function registerAppEvents_bus_condition_subscribe(component: VComponent, bus: EventBus, constraint: any, type: string, resolve: any) {

    let busContext = component.__.appEventContexts.get(bus)

    if (!busContext) {
        busContext = component.__.appEventContexts.set(bus, new Map()).get(bus)
        busContext.set(type, resolve)
    } else {
        busContext.set(type, resolve)
    }

    if (!resolve) {
        resolve = component.forceUpdate
    }

    if (constraint === null) {
        bus.subscribe(type, resolve)
    } else {
        bus.constraint(constraint, type, resolve)
    }

    return {
        on: (type: string, resolve: any) => registerAppEvents_bus_condition_subscribe(component, bus, constraint, type, resolve)
    }
}