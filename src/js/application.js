import "../sass/application.scss"
import RipplePlugin from "./ui/plugins/RipplePlugin"
import EmojiPlugin from "./ui/plugins/EmojiPlugin"
import AppRoutes from "./ui/routing"
import {XProto} from "./mtproto/XProto"
import V from "./ui/v/VFramework"
import {StickerManager} from "./api/stickersManager"

const isProduction = false

export const defaultDcID = 2

function start() {
    // MTProto.invokeMethod("help.getNearestDc", {}).then(response => {
    //     console.log("dc", response)
    //
    //     if (response.this_dc !== response.nearest_dc) {
    //         MTProto.changeDefaultDC(response.nearest_dc)
    //         // TODO country response.country
    //
    //
    //         AppEvents.General.fire("nearestDc", {
    //             dcResponse: response
    //         })
    //     }
    // })
}

function startUI() {
    V.registerPlugin(RipplePlugin)
    V.registerPlugin(EmojiPlugin)

    V.useRoutes(AppRoutes)

    V.mount("#app")
}

// global.Peers = PeersStore
// global.Dialogs = PeersStore
// global.EVE = AppEvents

// global.bi = VBigInt

// if (isProduction) {
//     AppCache.open()
// } else {
window.StickerManager = StickerManager
// }

console.log(
    <div>
        <span>text</span>
        <a ref="some" href="http://google.com">Google</a>
    </div>
)

XProto.connect().then(result => {
    console.log("CONNECTED", result)
})

startUI()
// loadSchema().then(() => {
//     MTProto.connect(authContext)
//         .then(start)
// })