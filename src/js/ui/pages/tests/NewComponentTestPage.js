import {VComponent} from "../../v/vrdom/component/VComponent"
import AppEvents from "../../../api/eventBus/AppEvents"
import type {BusEvent} from "../../../api/eventBus/EventBus"
import {ReactiveObject} from "../../v/reactive/ReactiveObject"
import ReactiveCallback from "../../v/reactive/ReactiveCallback"


class NewReactiveObject extends ReactiveObject {
    constructor(props = {}) {
        super()

        this._someProp = props.s || "none"
    }

    set someProp(someProp) {
        this._someProp = someProp
        this.fire("somePropUpdated")
    }

    get someProp() {
        return this._someProp
    }
}

const xsubscribers = new Set()
let XC = "ggg"

const XCallback = ReactiveCallback(subscription => {
    xsubscribers.add(subscription)
    return XC
}, subscription => xsubscribers.delete(subscription))

const changeXC = v => {
    XC = v
    xsubscribers.forEach(s => s(XC))
}

const xrsubscribers = new Set()
let XRC = new NewReactiveObject({
    s: "FUCK"
})

const XRCallback = ReactiveCallback(subscription => {
    xrsubscribers.add(subscription)
    return XRC
}, subscription => xrsubscribers.delete(subscription))

const changeXRC = v => {
    XRC = v
    xrsubscribers.forEach(s => s(XC))
}

const DateFragment = ({date, click}) => {
    return <h1 onClick={click}>{date}</h1>
}

class NewComponent extends VComponent {

    dateFragmentRef = VComponent.createFragmentRef()

    init() {
        this.rc = new NewReactiveObject()

        this.state = {
            someValue: "xxx",
            noValue: {
                value: "xxxa"
            }
        }

        this.callbacks = {
            X: XCallback.FireOnly,
            XR: XRCallback.FireOnly,
        }

        // this.withInterval(() => {
        //     // console.log("1")
        //     this.state.someValue = new Date().toISOString()
        // }, 100)
    }

    appEvents(E) {
        E.bus(AppEvents.General)
            .on("clickEvent", this.onEvent)
            .on("xEvent", this.onEvent)

        // E.bus(AppEvents.General)
        // .callbackCondition("someCallback")
        // .on("someEvent")
    }

    reactive(R) {
        R.object(this.rc)
            .on("somePropUpdated", this.__patch)
    }

    callbackChanged(key: string, value: *) {
        console.log(key, value)
    }

    h() {
        return (
            <div>

                <DateFragment click={() => {
                    this.dateFragmentRef.patch({date: new Date()})
                }} ref={this.dateFragmentRef} date={"no date"}/>


                {/*<h1>VF Component {this.state.someValue}</h1>*/}
                {/*<input type="text" value={this.state.someValue}*/}
                {/*       onInput={event => this.state.someValue = event.target.value}/>*/}
                {/*<textarea onInput={event => this.state.someValue = event.target.value} value={this.state.someValue}/>*/}
                {/*<button onClick={this.handleButtonClick}>Click</button>*/}
                {/*<button onClick={() => this.state.someValue = Math.random()}>Random</button>*/}
                {/*<button onClick={() => changeXC(Math.random() * 10)}>Change XC</button>*/}
                {/*<button onClick={() => this.callbacks.XR.someProp = "Huh" + Math.random()}>Fire XRC</button>*/}
                {/*{Array.from({length: 100}, () => <div>{this.state.someValue}</div>)}*/}
            </div>
        )
    }

    patched() {
        // console.log("patched")
    }

    handleButtonClick = event => {
        AppEvents.General.fire("clickEvent", {c: this})
        AppEvents.General.fire("xEvent", {c: this})
    }

    onEvent = (event: BusEvent) => {
        console.warn("onEvent", event)
    }

    somePropUpdated = (...attrs) => {
        console.log("somePropUpdated", attrs)
        this.__patch()
    }

}

AppEvents.General.subscribe("clickEvent", event => {
    console.log("suck", event)
})

export function NewComponentPage() {
    return (
        <div>
            <NewComponent/>
        </div>
    )
}