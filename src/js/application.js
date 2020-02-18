import "../sass/application.scss"

import VF from "./V/VFramework"
import MTProto from "./MTProto/external"
import AppCache from "./Api/Cache/AppCache"
import PeersStore from "./Api/Store/PeersStore"
import AppEvents from "./Api/EventBus/AppEvents"
import RipplePlugin from "./Ui/plugins/RipplePlugin"
import EmojiPlugin from "./Ui/plugins/EmojiPlugin"
import AppRoutes from "./Ui/routing"
import {StickerManager} from "./Api/Stickers/StickersManager";
import VBigInt from "./MTProto/bigint/VBigInt"

const isProduction = false

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





// import "../sass/application.scss"

// import XVComponent from "./V/X/Component/XVComponent"
// import Random from "./MTProto/utils/random"
// import "./V/__examples/2048/index.css"
// import XVRDOM from "./V/X/XVRDOM"
// import {SearchList} from "./V/__examples/filteredlist"
// import {PreactGHExample} from "./V/__examples/ghreporeact"
// import PreactTodoList from "./V/__examples/preacttodo"
// import Game from "./V/__examples/2048/Game"
//
// class TimeComponent extends XVComponent {
//
//     updatesCount = 0
//
//     init() {
//         console.log("fukc")
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
// class XTimeComponent extends XVComponent {
//
//     updatesCount = 0
//
//     init() {
//         console.log("fukc x")
//     }
//
//     render() {
//         return <h2>{this.props.time.getTime()} | {this.updatesCount++}</h2>
//     }
// }
//
// class SomeComponent extends XVComponent {
//
//     state = {
//         counter: 0,
//         time: new Date()
//     }
//
//     init() {
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
// XVRDOM.mount(<SomeComponent/>, "#app")
//
// // XVRDOM.mount(<Game fieldSize={4}/>, "#app")
// // XVRDOM.mount(<Game fieldSize={128}/>, "#app")
// // XVRDOM.mount(<Layout/>, "#app")
// // XVRDOM.mount(<PreactGHExample/>, "#app")
// // XVRDOM.mount(<PreactTodoList/>, "#app")
// // const $el = XVRDOM.mount(<div>
// //     <SearchList list={new Array(1000).fill(``).map(() => `${Math.random()}`)}/>
// // </div>, "#app")