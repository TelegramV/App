import "../sass/application.scss"

import './ui/vendor/tgs-player.js';
import AppFramework from "./ui/framework/framework"
import MTProto from "./mtproto"
import AppCache from "./api/cache"
import {loadSchema} from "./mtproto/language/schema"
import PeersStore from "./api/store/PeersStore"
import AppEvents from "./api/eventBus/AppEvents"
import {createNonce} from "./mtproto/utils/bin"
import RipplePlugin from "./ui/plugins/RipplePlugin"
import AppRoutes from "./ui/routing"
import {StickerManager} from "./api/stickersManager";

const isProduction = false

export const defaultDcID = 2

const authContext = {
    dcID: defaultDcID,
    nonce: createNonce(16),
    sessionID: createNonce(8)
}

function start() {
    MTProto.invokeMethod("help.getNearestDc", {}).then(response => {
        console.log("dc", response)

        if (response.this_dc !== response.nearest_dc) {
            MTProto.changeDefaultDC(response.nearest_dc)
            // TODO country response.country


            AppEvents.General.fire("nearestDc", {
                dcResponse: response
            })
        }
    })

    AppFramework.registerPlugin(RipplePlugin)

    AppFramework.useRoutes(AppRoutes)

    AppFramework.mount("#app")
}

global.Peers = PeersStore
global.Dialogs = PeersStore
global.EVE = AppEvents

if (isProduction) {
    AppCache.open()
} else {
    window.StickerManager = StickerManager
}



loadSchema().then(() => {
    MTProto.connect(authContext)
        .then(start)
})