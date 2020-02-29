import "../sass/application.scss"

import MTProto from "./MTProto/external"
import AppCache from "./Api/Cache/AppCache"

import VApp from "./vapp"
import AppRoutes from "./Ui/Routing"
import RippleVRDOMPlugin from "./Ui/Plugins/RipplePlugin"
import EmojiVRDOMPlugin from "./Ui/Plugins/EmojiPlugin"

import "./globals"

if (__IS_PRODUCTION__) {
    AppCache.open()
}

import("lottie-web").then(Module => {
    global.lottie = Module.default

    VApp.registerPlugin(RippleVRDOMPlugin)
    VApp.registerPlugin(EmojiVRDOMPlugin)
    VApp.useRoutes(AppRoutes)
    VApp.mount("#app")
    
    MTProto.connect()
})