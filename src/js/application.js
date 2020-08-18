import "../sass/application.scss"

import MTProto from "./MTProto/External"
import AppCache from "./Api/Cache/AppCache"

import VApp from "./V/vapp"
import VRDOM from "./V/VRDOM/VRDOM"
import AppRoutes from "./Ui/Routing"

import RippleVRDOMPlugin from "./Ui/Plugins/RipplePlugin"
import LongtapVRDOMPlugin from "./Ui/Plugins/LongtapPlugin"
import HorizontalScrollVRDOMPlugin from "./Ui/Plugins/HorizontalScrollPlugin"

import PeerFactory from "./Api/Peers/PeerFactory"
import PeersStore from "./Api/Store/PeersStore"

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
    window.VRDOM = VRDOM
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

    if (__IS_PRODUCTION__) {
        document.title = "Telegram V (Beta)"
    } else {
        document.title = "[dev] Telegram V"
    }
})