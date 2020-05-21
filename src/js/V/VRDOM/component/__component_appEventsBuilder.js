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