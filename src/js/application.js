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

// TODO implement 2FA https://core.telegram.org/api/srp
// @o.tsenilov
function password() {
    console.log("start_2fa");
    MTProto.invokeMethod("account.getPassword", {}).then(response => {
        /*if (response._ !== "passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow") {
            throw new Error("Unknown 2FA algo")
        }*/
        //console.log(response)
        //setCode2FAForm()
        const salt1 = response.current_algo.salt1
        const salt2 = response.current_algo.salt2
        const g = response.current_algo.g
        const p = response.current_algo.p
        console.log(salt1);
        const srp_id = response.srp_id
        const srp_B = response.srp_B

        const srp_ret = mt_srp_check_password(g, p, salt1, salt2, srp_id, srp_B, "password");
        //TODO: засунуть куда-то эту хуйню

        MTProto.invokeMethod("auth.checkPassword", {
            password: {
                _: "inputCheckPasswordSRP",
                srp_id: srp_ret.srp_id,
                A: srp_ret.A,
                M1: srp_ret.M1
            }
        }).then(response => {
            console.log(response);
            //authorizedStart(response)
        })
        /*document.getElementById("loginSendCode2FAButton").addEventListener("click", event => {
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
        })*/
    })
}

function start() {
    // password();
    /*AppFramework.Router.route("/login", "login", {
        h() {
            return document.createElement("div")
        }
    })*/
    AppFramework.Router.route("/login", "login", {
        h() {
            return LoginPage()
        }
    })

    AppFramework.Router.route("/", "main", {
        h() {
            console.log("ll")
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

MTProto.connect(authContext, function () {
    start()
}, this)

