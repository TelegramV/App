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