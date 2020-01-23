import "../sass/application.scss"

let lottie = "@lottiefiles/lottie-player"
require(`${lottie}`); //Trick to bypass "Critical dependency" warning
import AppFramework from "./ui/framework/framework"
import MTProto from "./mtproto"
import {MainPage} from "./ui/pages/main/mainPage"
import {LoginPage} from "./ui/pages/login/nextlogin"
import AppCache from "./api/cache"
import {loadSchema} from "./mtproto/language/schema"
import PeersStore from "./api/store/peersStore"
import AppEvents from "./api/eventBus/appEvents"
import {createNonce} from "./mtproto/utils/bin"
import RipplePlugin from "./ui/plugins/RipplePlugin"

const isProduction = false

const authContext = {
    dcID: 2,
    nonce: createNonce(16),
    sessionID: createNonce(8)
}

function start() {
    MTProto.invokeMethod("help.getNearestDc", {}).then(response => {
        if (response.this_dc !== response.nearest_dc) {
            MTProto.changeDefaultDC(response.nearest_dc)
            // TODO country response.country
        }
    })

    AppFramework.registerPlugin(RipplePlugin)

    AppFramework.Router.route("/login", "login", {
        h() {
            return LoginPage()
        }
    })

    AppFramework.Router.route("/", "main", {
        h() {
            return MainPage()
        }
    })

    AppFramework.Router.middleware(toRoute => {
        if (!MTProto.isUserAuthorized()) {
            if (toRoute.route.name !== "login") {
                return {
                    next: false,
                    doNext: () => {
                        AppFramework.Router.push("/login")
                    },
                }
            }
        } else {
            if (toRoute.route.name === "login") {
                return {
                    next: false,
                    doNext: () => {
                        AppFramework.Router.push("/")
                    }
                }
            }
        }

        return true
    })

    AppFramework.mount("#app")
}

global.Peers = PeersStore
global.Dialogs = PeersStore
global.EVE = AppEvents

if (isProduction) {
    AppCache.open()
}


loadSchema().then(() => MTProto.connect(authContext).then(start))