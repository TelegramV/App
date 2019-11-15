import {MTProto} from "./mtproto"
import {createNonce} from "./mtproto/utils/bin"
//import {setCode2FAForm} from "./ui/login/loginPage"
import {AppPermanentStorage} from "./common/storage"
import {LoginPage} from "./ui/pages/login"
import {IMPage} from "./ui/pages/im"
import {AppFramework} from "./ui/framework/framework"

import "../sass/application.scss"

const authContext = {
    dcID: 2,
    nonce: createNonce(16),
    sessionID: createNonce(8) // TODO check if secure?
}

function authorizedStart(authorizationData) {
    AppPermanentStorage.setItem("authorizationData", authorizationData)
}

// TODO implement 2FA https://core.telegram.org/api/srp
// @o.tsenilov
function password() {
    MTProto.invokeMethod("account.getPassword", {}).then(response => {
        if (response._ !== "passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow") {
            throw new Error("Unknown 2FA algo")
        }
        setCode2FAForm()

        const salt1 = response.salt1
        const salt2 = response.salt2
        const g = response.g
        const p = response.p

        document.getElementById("loginSendCode2FAButton").addEventListener("click", event => {
            const code = document.getElementById("code2FAInput").value
            MTProto.invokeMethod("auth.checkPassword", {
                password: {
                    _: "inputCheckPasswordSRP",
                    srp_id: srpId,
                    A: aBytes,
                    M1: m1Bytes
                }
            }).then(response => {
                authorizedStart(response)
            })
        })
    })
}

function start() {
    AppFramework.Router.route("/login", "login", {
        h() {
            return <LoginPage/>
        }
    })

    AppFramework.Router.route("/", "main", {
        h() {
            return <IMPage/>
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

MTProto.connect(authContext, function () {
    start()
}, this)
