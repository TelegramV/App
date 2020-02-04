import {EventBus} from "../../../../api/eventBus/EventBus"
import {VComponent} from "./VComponent"


// types

export type AESubscribe = {
    on(type: string, resolve: any): AESubscribe
}

export type AECondition = AESubscribe | {
    condition(condition: any): AESubscribe,
    callbackCondition(callbackName: string): AESubscribe,
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
        condition: (condition: any) => registerAppEvents_bus_condition(component, bus, condition),
        callbackCondition: (callbackName: any) => registerAppEvents_bus_callbackCondition(component, bus, callbackName),
        on: (type: string, resolve: any) => registerAppEvents_bus_condition_subscribe(component, bus, null, type, resolve)
    }
}

function registerAppEvents_bus_condition(component: VComponent, bus: EventBus, condition: any) {
    return {
        on: (type: string, resolve: any) => registerAppEvents_bus_condition_subscribe(component, bus, condition, type, resolve)
    }
}

function registerAppEvents_bus_condition_subscribe(component: VComponent, bus: EventBus, condition: any, type: string, resolve: any) {

    component.__registerAppEventResolve(bus, type, resolve, condition)

    return {
        on: (type: string, resolve: any) => registerAppEvents_bus_condition_subscribe(component, bus, condition, type, resolve)
    }
}


// callbackCondition

function registerAppEvents_bus_callbackCondition(component: VComponent, bus: EventBus, condition: any) {
    return {
        on: (type: string, resolve: any) => registerAppEvents_bus_callbackCondition_subscribe(component, bus, condition, type, resolve)
    }
}

function registerAppEvents_bus_callbackCondition_subscribe(component: VComponent, bus: EventBus, condition: any, type: string, resolve: any) {

    component.__registerAppEventResolve(bus, type, resolve, condition)

    return {
        on: (type: string, resolve: any) => registerAppEvents_bus_callbackCondition_subscribe(component, bus, condition, type, resolve)
    }
}
