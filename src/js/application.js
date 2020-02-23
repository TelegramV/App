import "../sass/application.scss"

import VF from "./V/VFramework"
import MTProto from "./MTProto/external"
import AppCache from "./Api/Cache/AppCache"
import PeersStore from "./Api/Store/PeersStore"
import AppEvents from "./Api/EventBus/AppEvents"
import RipplePlugin from "./Ui/Plugins/RipplePlugin"
import EmojiPlugin from "./Ui/Plugins/EmojiPlugin"
import AppRoutes from "./Ui/Routing"
import {StickerManager} from "./Api/Stickers/StickersManager";
import VBigInt from "./MTProto/bigint/VBigInt"
import VRoute from "./V/Router/VRoute"
import RouterView from "./V/Router/RouterView"

const isProduction = false


// future version should have ability to do things in the such way:
// const router = new VFrameworkRouter([
//     new VRoute("/", VMainPage),
//     new VRoute("/login", VLoginPage),
// ])
//
// const VApp = new VFramework({
//     router,
//     render: () => <div><RouterView/></div>
// })
//
// VApp.mount("#app")

function start() {
    MTProto.invokeMethod("help.getNearestDc", {}).then(response => {
        console.log("dc", response)

        if (response.this_dc !== response.nearest_dc) {
            MTProto.changeDefaultDC(response.nearest_dc)

            AppEvents.General.fire("nearestDc", {
                dcResponse: response
            })
        }
    })
}

function startUI() {
    VF.registerPlugin(RipplePlugin)
    VF.registerPlugin(EmojiPlugin)

    VF.useRoutes(AppRoutes)

    VF.mount("#app")
}

global.Peers = PeersStore
global.Dialogs = PeersStore
global.EVE = AppEvents

global.bi = VBigInt

if (isProduction) {
    AppCache.open()
} else {
    window.StickerManager = StickerManager
    window.send = (method, params) => {
        MTProto.invokeMethod(method, params).then(result => {
            console.log(result);
        })
    }
}

startUI()
MTProto.connect().then(start)


// // import "../sass/application.scss"
//
// import Random from "./MTProto/utils/random"
// import VComponent from "./V/VRDOM/component/VComponent"
// import VRDOM from "./V/VRDOM/VRDOM"
// import Game from "./V/__examples/2048/Game"
// import "./V/__examples/2048/index.css"
// import Layout from "./V/__examples/sidebars/sidebars"
// import {PreactGHExample} from "./V/__examples/ghreporeact"
// import PreactTodoList from "./V/__examples/preacttodo"
// import {SearchList} from "./V/__examples/filteredlist"
//
// class TimeComponent extends VComponent {
//
//     updatesCount = 0
//
//     init() {
//         // console.log("fukc")
//     }
//
//     // shouldComponentUpdate({time}, nextState): boolean {
//     //     return Math.floor(time.getTime() / 1000) !== Math.floor(this.props.time.getTime() / 1000)
//     // }
//
//     render() {
//         return <h1>{this.props.time.getTime()} | {this.updatesCount++}</h1>
//     }
// }
//
// class XTimeComponent extends VComponent {
//
//     updatesCount = 0
//
//     init() {
//         // console.log("fukc x")
//     }
//
//     render() {
//         return <h2>{this.props.time.getTime()} | {this.updatesCount++}</h2>
//     }
// }
//
// class Nono extends VComponent {
//
//     init() {
//         // console.log("initing nono")
//     }
//
//     render() {
//         console.log("rendering", this.displayName)
//         return <b>{this.props.wat}</b>
//     }
// }
//
// Nono.defaultProps = {
//     wat: "defa"
// }
//
// class SomeComponent extends VComponent {
//
//     state = {
//         counter: 0,
//         time: new Date()
//     }
//
//     init() {
//         console.log("initing some")
//         setInterval(() => {
//             this.setState({
//                 time: new Date()
//             })
//         }, 1000)
//     }
//
//     render() {
//         const rand = Random.nextInteger(2)
//
//         return <div>
//             <h1>{this.props.title}</h1>
//             {this.state.counter}
//             <button onClick={this.incrementCounter}>Increment</button>
//
//             {rand === 1 ? <Nono wat={"nat"}/> : <div><Nono/> {rand}</div>}
//             {/*{rand === 1 ? <Nono wat={"nat"}/> : <div>kek</div>}*/}
//
//             {rand === 1 ? <TimeComponent time={this.state.time}/> :
//                 <XTimeComponent time={new Date(10, 1, 2)}/>}
//         </div>
//     }
//
//     incrementCounter = () => {
//         this.setState({
//             counter: this.state.counter + 1
//         })
//     }
// }
//
// SomeComponent.defaultProps = {
//     title: "wow"
// }
//
// // VRDOM.mount(<SomeComponent/>, "#app")
//
// VRDOM.mount(<Game fieldSize={4}/>, "#app")
// // VRDOM.mount(<Game fieldSize={128}/>, "#app")
// // VRDOM.mount(<Layout/>, "#app")
// // VRDOM.mount(<PreactGHExample/>, "#app")
// // VRDOM.mount(<PreactTodoList/>, "#app")
// // const $el = VRDOM.mount(<div>
// //     <SearchList list={new Array(10000).fill(``).map(() => `${Math.random()}`)}/>
// // </div>, "#app")