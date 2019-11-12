import {MTProto} from "./mtproto"
import {createNonce} from "./mtproto/utils/bin"
import {createLogger} from "./common/logger";
import {setCode2FAForm} from "./ui/login/loginPage"
import {AppPermanentStorage} from "./common/storage"
import {LoginPage} from "./ui/pages/login"
import {IMPage} from "./ui/pages/im"
import {TelegramDialogComponent} from "./ui/pages/im/components/dialog"
import {AppFramework} from "./ui/framework/framework"
import {DialogListComponent} from "./ui/pages/im/components/dialogList"

import "../sass/styles.scss"
import {MessageListComponent} from "./ui/pages/im/components/messageList"
import {MessageComponent} from "./ui/pages/im/components/message"


const Logger = createLogger("Main")

const authContext = {
    dcID: 2,
    nonce: createNonce(16),
    sessionID: createNonce(8) // TODO check if secure?
}

function authorizedStart(authorizationData) {
    AppPermanentStorage.setItem("authorizationData", authorizationData)

    console.log(authorizationData)

    // MTProto.invokeMethod("messages.getDialogs", {
    //     flags: 0,
    //     pFlags: {
    //         exclude_pinned: false,
    //         folder_id: false
    //     },
    //     offset_date: 0,
    //     offset_id: 0,
    //     offset_peer: {
    //         _: "inputPeerEmpty"
    //     },
    //     limit: 20,
    //     hash: ""
    // }).then(result => {
    //     console.log(result)
    //
    //     renderDialogsSlice(result)
    // })

    /*MTProto.invokeMethod("contacts.importContacts", {
        contacts: [
            {
                _: "inputPhoneContact",
                first_name: "maksim",
                last_name: "sunduk",
                phone: "380956031588",
                client_id: 1234
            }
        ]
    }).then(response => {
console.log(response)
    })*/
    // 340271
    /*MTProto.invokeMethod("users.getFullUser", {
        id:
            {
                _: "inputUser",
                user_id: 196706924
            }

    })*/
    /*MTProto.invokeMethod("messages.sendMessage", {
        flags: 0,
        pFlags: {},
        peer: {
            _: "inputPeerUser",
            user_id: 196706924
        },
        message: "weeb'o gram",
        random_id: createNonce(8)
    })*/
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
    AppFramework.registerComponent("login-page", LoginPage)
    AppFramework.registerComponent("im-page", IMPage)
    AppFramework.registerComponent("dialog-list-component", DialogListComponent)
    AppFramework.registerComponent("telegram-dialog-component", TelegramDialogComponent)
    AppFramework.registerComponent("message-list-component", MessageListComponent)
    AppFramework.registerComponent("message-component", MessageComponent)

    AppFramework.Router.route("login", {
        render() {
            return `<login-page></login-page>`
        }
    })

    AppFramework.Router.route("/", {
        render() {
            return `<im-page></im-page>`
        }
    })

    AppFramework.mount("#app")

    if (!MTProto.isUserAuthorized()) {
        AppFramework.Router.push("/login")
    } else {
        AppFramework.Router.push("/")
    }
}

MTProto.connect(authContext, function () {
    start();
}, this)