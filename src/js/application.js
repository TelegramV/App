import "../sass/application.scss"

import MTProto from "./MTProto/External"
import AppCache from "./Api/Cache/AppCache"

import VApp from "./V/vapp"
import AppRoutes from "./Ui/Routing"

import RippleVRDOMPlugin from "./Ui/Plugins/RipplePlugin"
import LongtapVRDOMPlugin from "./Ui/Plugins/LongtapPlugin"
import HorizontalScrollVRDOMPlugin from "./Ui/Plugins/HorizontalScrollPlugin"

import PeerFactory from "./Api/Peers/PeerFactory"
import PeersStore from "./Api/Store/PeersStore"
import Locale from "./Api/Localization/Locale"
import Settings from "./Api/Settings/Settings"

import keval from "./Keval/keval"
import API from "./Api/Telegram/API"
import {FileAPI} from "./Api/Files/FileAPI"

import "./globals"
import "./polyfills"

import "../../vendor/swipes"

if (__IS_PRODUCTION__) {
    document.title = "Connecting.."
    console.log("%c%s", "color: #4ea4f6; font-size: 4em;", "Telegram V")
    console.log("%c%s", "color: #DF3F40; font-size: 1.5em;", "using console may slow down the application")
    AppCache.open()
} else {
    document.title = "[dev] Connecting.."
    window.invoke = MTProto.invokeMethod
    window.devkeval = keval
    window.telegram = API
    window.files = FileAPI
    window.locale = Locale
    window.settings = Settings
}

VApp.registerPlugin(RippleVRDOMPlugin)
VApp.registerPlugin(HorizontalScrollVRDOMPlugin)
VApp.registerPlugin(LongtapVRDOMPlugin)
VApp.useRoutes(AppRoutes)

if (document.getElementById("page-loader")) {
    document.getElementById("page-loader").remove()
}

VApp.mount("#app")

MTProto.connect().then(user => {
    if (user) {
        PeersStore.set(PeerFactory.fromRaw(user));
    }

    Settings.init();
    Locale.init();

    if (__IS_PRODUCTION__) {
        document.title = "Telegram V (Beta)"
    } else {
        document.title = "[dev] Telegram V"
    }
})

// import xcreateElement from "./V/VRDOM/xpatch/xcreateElement"
// import diff from "./V/VRDOM/xpatch/xdiff"
// import Component from "./V/VRDOM/xpatch/xComponent"
//
// global.VRDOM = {
//     createElement: xcreateElement,
// }
//
// const $app = document.getElementById("app");
//
// function Button(props) {
//     return <button {...props}>Increment</button>
// }
//
// class IN extends Component {
//     render() {
//         return <div>kek {JSON.stringify(this.props)}</div>
//     }
// }
//
// class Win extends Component {
//     state = {
//         value: "",
//     }
//
//     render(props) {
//         // props.kek = Math.random();
//         // return <IN {...props}/>
//         return <div>kek
//             <br/>
//             {this.state.value}
//             <br/>
//             <input value={this.state.value} type="text" onInput={event => {
//                 this.setState({
//                     value: event.target.value,
//                 })
//             }}/></div>
//     }
//
//     // componentDidMount() {
//     //     console.warn("WIN MOUNTED")
//     // }
//     //
//     // componentWillUnmount() {
//     //     console.warn("WIN WILL UNMOUNT")
//     // }
//     //
//     // componentDidUpdate() {
//     //     console.warn("WIN UPDATED")
//     // }
// }
//
// Win.defaultProps = {
//     kek: "lol"
// }
//
// let i = 1;
//
// const render = () => (
//     <div>
//         test
//         {String(i)}
//         <button onClick={() => {
//             i++;
//             diffdom()();
//         }}>Increment
//         </button>
//         <Button onClick={() => {
//             i++;
//             diffdom()();
//         }}/>
//         <Win/>
//         {/*{i % 2 === 0 && <Win/>}*/}
//     </div>
// )
//
// console.log(render())
//
// const diffdom = () => diff($app, render());
//
// diffdom()();