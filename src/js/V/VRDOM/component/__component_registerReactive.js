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

import {ReactiveObject} from "../../Reactive/ReactiveObject"
import VComponent from "./VComponent"


// types

export type ROSubscribe = {
    on(type: string, resolve: any): ROSubscribe,
    // onProperty(key: string, resolve: any): ROSubscribe
}

export type RORC = {
    object(reactiveObject: ReactiveObject): ROSubscribe,
    fromProps(name: string): ROSubscribe,
}


// functions

export function __component_registerReactive(component: VComponent) {
    return {
        object: (object: ReactiveObject) => registerReactive_object(component, object),
        fromProps: (name: string) => registerReactive_fromProps(component, name),
    }
}

function registerReactive_object(component: VComponent, object: ReactiveObject) {
    return {
        on: (type: string, resolve: any) => registerReactive_object_subscribe(component, object, type, resolve)
    }
}

function registerReactive_object_subscribe(component: VComponent, object: ReactiveObject, type: string, resolve: any) {

    let reactiveObjectContext = component.__.reactiveObjectContexts.get(object)

    if (!reactiveObjectContext) {
        reactiveObjectContext = component.__.reactiveObjectContexts.set(object, new Map()).get(object)
        reactiveObjectContext.set(type, resolve)
    } else {
        reactiveObjectContext.set(type, resolve)
    }

    object.subscribe(type, resolve)
    return {
        on: (type: string, resolve: any) => registerReactive_object_subscribe(component, object, type, resolve)
    }
}