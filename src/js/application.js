import {MTProto} from "./mtproto"
import {createNonce} from "./mtproto/utils/bin"
//import {setCode2FAForm} from "./ui/login/loginPage"
import {AppPermanentStorage} from "./common/storage"
import mt_srp_check_password from "./mtproto/crypto/mt_srp/mt_srp"

import "../sass/application.scss"
import {ImPage} from "./ui/pages/im/impage"
import {LoginPage} from "./ui/pages/login/nextlogin"
import {AppFramework} from "./ui/framework/framework"
import {attach} from "./api/notifications";

const authContext = {
    dcID: 2,
    nonce: createNonce(16),
    sessionID: createNonce(8) // TODO check if secure?
}

function authorizedStart(authorizationData) {
    AppPermanentStorage.setItem("authorizationData", authorizationData)
}


function start() {
    MTProto.invokeMethod("help.getNearestDc", {}).then(response => {
        if(response.this_dc !== response.nearest_dc) {
            MTProto.changeDefaultDC(response.nearest_dc)
            // TODO country response.contry
        }
    })

    AppFramework.Router.route("/login", "login", {
        h() {
            return LoginPage()
        }
    })

    AppFramework.Router.route("/", "main", {
        h() {
            return ImPage()
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

MTProto.connect(authContext).then(start)