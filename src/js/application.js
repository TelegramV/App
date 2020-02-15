import "../sass/application.scss"

import VF from "./ui/v/VFramework"
import MTProto from "./mtproto/external"
import AppCache from "./api/cache"
import PeersStore from "./api/store/PeersStore"
import AppEvents from "./api/eventBus/AppEvents"
import RipplePlugin from "./ui/plugins/RipplePlugin"
import EmojiPlugin from "./ui/plugins/EmojiPlugin"
import AppRoutes from "./ui/routing"
import {StickerManager} from "./api/stickersManager";
import VBigInt from "./mtproto/bigint/VBigInt"

const isProduction = true

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