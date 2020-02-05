import {ReactiveObject} from "../../reactive/ReactiveObject"
import {VComponent} from "./VComponent"


// types

export type ROSubscribe = {
    on(type: string, resolve: any): ROSubscribe,
    // onProperty(key: string, resolve: any): ROSubscribe
}

export type RORC = {
    object(reactiveObject: ReactiveObject): ROSubscribe,
    callback(key: string): ROSubscribe,
}


// functions

export function registerReactive(component: VComponent) {
    return {
        object: (object: ReactiveObject) => registerReactive_object(component, object),
        callback: () => console.error("unimplemented"),
    }
}

function registerReactive_object(component: VComponent, object: ReactiveObject) {
    return {
        on: (type: string, resolve: any) => registerReactive_object_subscribe(component, object, type, resolve)
    }
}

function registerReactive_object_subscribe(component: VComponent, object: ReactiveObject, type: string, resolve: any) {

    component.__registerReactiveObjectResolve(object, type, resolve)

    return {
        on: (type: string, resolve: any) => registerReactive_object_subscribe(component, object, type, resolve)
    }
}