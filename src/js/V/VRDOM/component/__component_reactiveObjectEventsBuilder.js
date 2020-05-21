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

import {ReactiveObject} from "../../Reactive/ReactiveObject"


// types

export type ROSubscribe = {
    on(type: string, resolve: any): ROSubscribe,
    updateOn(type: string): ROSubscribe,
}

export type RORC = {
    object(reactiveObject: ReactiveObject): ROSubscribe,
}


// functions

function __object(component, object: ReactiveObject) {
    return {
        on: (type: string, resolve: any) => __object_subscribe(component, object, type, resolve),
        updateOn: (type: string) => __object_subscribe(component, object, type, component.forceUpdate)
    }
}

function __object_subscribe(component, object: ReactiveObject, type: string, resolve: any) {
    let reactiveObjectContext = component.__.reactiveObjectContexts.get(object)

    if (!reactiveObjectContext) {
        reactiveObjectContext = component.__.reactiveObjectContexts.set(object, new Map()).get(object)
        reactiveObjectContext.set(type, resolve)
    } else {
        reactiveObjectContext.set(type, resolve)
    }

    object.subscribe(type, resolve)

    return {
        on: (type: string, resolve: any) => __object_subscribe(component, object, type, resolve),
        updateOn: (type: string) => __object_subscribe(component, object, type, component.forceUpdate)
    }
}

export function __component_reactiveObjectEventsBuilder(component) {
    return {
        object: (object: ReactiveObject) => __object(component, object),
    }
}