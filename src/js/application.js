import "../sass/application.scss"

import "@lottiefiles/lottie-player"
import AppFramework from "./ui/framework/framework"
import MTProto from "./mtproto"
import AppCache from "./api/cache"
import {loadSchema} from "./mtproto/language/schema"
import PeersStore from "./api/store/PeersStore"
import AppEvents from "./api/eventBus/AppEvents"
import {createNonce} from "./mtproto/utils/bin"
import RipplePlugin from "./ui/plugins/RipplePlugin"
import AppRoutes from "./ui/routing"

const isProduction = false

const authContext = {
    dcID: 2,
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
}


loadSchema().then(() => {
    MTProto.connect(authContext)
        .then(start)
})