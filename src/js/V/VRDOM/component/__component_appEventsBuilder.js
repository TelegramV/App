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

export function __component_appEventsBuilder(component): AE {
    return {
        bus: (bus: EventBus) => __bus(component, bus)
    }
}

function __bus(component, bus: EventBus) {
    return {
        only: (callback: any) => __bus_filter(component, bus, callback),
        filter: (callback: any) => __bus_filter(component, bus, callback),
        on: (type: string, resolve: any) => __bus_filter_subscribe(component, bus, null, type, resolve),
        updateOn: (type: string) => __bus_filter_subscribe(component, bus, null, type, null)
    }
}

function __bus_filter(component, bus: EventBus, filter: any) {
    return {
        on: (type: string, resolve: any) => __bus_filter_subscribe(component, bus, filter, type, resolve),
        updateOn: (type: string) => __bus_filter_subscribe(component, bus, filter, type, null),
    }
}

function __bus_filter_subscribe(component, bus: EventBus, filter: any, type: string, resolve: any) {
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

    if (filter == null) {
        bus.subscribe(type, resolve)
    } else {
        bus.withFilter(filter, type, resolve)
    }

    return {
        on: (type: string, resolve: any) => __bus_filter_subscribe(component, bus, filter, type, resolve),
        updateOn: (type: string) => __bus_filter_subscribe(component, bus, filter, type, null),
    }
}