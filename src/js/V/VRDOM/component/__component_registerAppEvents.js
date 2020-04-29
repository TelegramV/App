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
    // if no resolve, then forceUpdate will be used instead
    on(type: string, resolve?: any): AESubscribe,
    updateOn(type: string): AESubscribe,
}

export type AECondition = AESubscribe | {
    /**
     * @deprecated use filter instead
     */
    only(callback: any): AESubscribe,
    filter(callback: any): AESubscribe,
}

export type AE = {
    bus(bus: EventBus): AECondition
}


// functions

export function __component_registerAppEvents(component: VComponent): AE {
    return {
        bus: (bus: EventBus) => registerAppEvents_bus(component, bus)
    }
}

function registerAppEvents_bus(component: VComponent, bus: EventBus) {
    return {
        only: (callback: any) => registerAppEvents_bus_only(component, bus, callback),
        filter: (callback: any) => registerAppEvents_bus_only(component, bus, callback),
        on: (type: string, resolve: any) => registerAppEvents_bus_only_subscribe(component, bus, null, type, resolve),
        updateOn: (type: string) => registerAppEvents_bus_only_subscribe(component, bus, null, type, null)
    }
}

function registerAppEvents_bus_only(component: VComponent, bus: EventBus, only: any) {
    return {
        on: (type: string, resolve: any) => registerAppEvents_bus_only_subscribe(component, bus, only, type, resolve),
        updateOn: (type: string) => registerAppEvents_bus_only_subscribe(component, bus, only, type, null),
    }
}

function registerAppEvents_bus_only_subscribe(component: VComponent, bus: EventBus, only: any, type: string, resolve: any) {
    let busContext = component.__.appEventContexts.get(bus)

    if (!resolve) {
        resolve = component.forceUpdate
    }

    if (!busContext) {
        busContext = component.__.appEventContexts.set(bus, new Map()).get(bus)
        busContext.set(type, resolve)
    } else {
        busContext.set(type, resolve)
    }

    if (only === null) {
        bus.subscribe(type, resolve)
    } else {
        bus.only(only, type, resolve)
    }

    return {
        on: (type: string, resolve: any) => registerAppEvents_bus_only_subscribe(component, bus, only, type, resolve),
        updateOn: (type: string) => registerAppEvents_bus_only_subscribe(component, bus, only, type, null),
    }
}