import "../sass/application.scss"

import MTProto from "./MTProto/External"
import AppCache from "./Api/Cache/AppCache"

import VApp from "./V/vapp"
import AppRoutes from "./Ui/Routing"
import RippleVRDOMPlugin from "./Ui/Plugins/RipplePlugin"
import EmojiVRDOMPlugin from "./Ui/Plugins/EmojiPlugin"

import PeerFactory from "./Api/Peers/PeerFactory"
import PeersStore from "./Api/Store/PeersStore"

import keval from "./Keval/keval"

import "./globals"

if (__IS_PRODUCTION__) {
    console.log("%c%s", "color: #4ea4f6; font-size: 4em;", "Telegram V")
    console.log("%c%s", "color: #DF3F40; font-size: 1.5em;", "using console may slow down the application")
    AppCache.open()
} else {
    document.title = "[dev] Telegram V"
    window.invoke = MTProto.invokeMethod
    window.devkeval = keval
}

VApp.registerPlugin(RippleVRDOMPlugin)
VApp.registerPlugin(EmojiVRDOMPlugin)
VApp.useRoutes(AppRoutes)
VApp.mount("#app")

MTProto.connect().then(user => {
    if (user) {
        PeersStore.set(PeerFactory.fromRaw(user));
    }

    console.log("connected");
})