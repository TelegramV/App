import {MTProto} from "./mtproto"
import {createNonce} from "./mtproto/utils/bin"

import "../sass/application.scss"
import {MainPage} from "./ui/pages/main/mainPage"
import {LoginPage} from "./ui/pages/login/nextlogin"
import {AppFramework} from "./ui/framework/framework"
import {loadSchema} from "./mtproto/language/schema"

import "./ui/vendor/tgs_player"
import {EventBus} from "./api/eventBus"


const authContext = {
    dcID: 2,
    nonce: createNonce(16),
    sessionID: createNonce(8) // TODO check if secure?
}

function start() {
    MTProto.invokeMethod("help.getNearestDc", {}).then(response => {
        if (response.this_dc !== response.nearest_dc) {
            MTProto.changeDefaultDC(response.nearest_dc)
            // TODO country response.contry
        }
    })

    global.UIEventBus = new EventBus()

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

loadSchema().then(() => MTProto.connect(authContext).then(start))