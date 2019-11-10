import {MTProto} from "./mtproto"
import {createNonce} from "./mtproto/utils/bin"
import {createLogger} from "./common/logger";
import {setCode2FAForm, setCodeForm, setPhoneForm, setSignUpForm} from "./ui/login/loginPage"
import {AppConfiguration} from "./configuration"
import {AppPermanentStorage} from "./common/storage"
import {renderDialogsSlice} from "./ui/app/dialogs"

const Logger = createLogger("Main")

const authContext = {
    dcID: 2,
    nonce: createNonce(16),
    sessionID: createNonce(8) // TODO check if secure?
}

function authorizedStart(authorizationData) {
    AppPermanentStorage.setItem("authorizationData", authorizationData)
    // MTProto.invokeMethod("messages.getAllChats", {
    //     except_ids: []
    // }).then(response => {
    //     console.log(response)
    //
    // }, error => {
    //     console.log(error)
    // })

    MTProto.invokeMethod("messages.getDialogs", {
        flags: {},
        exclude_pinned: false,
        folder_id: "",
        offset_date: "",
        offset_id: "",
        offset_peer: {
            _: "inputPeerEmpty"
        },
        limit: "",
        hash: ""
    }).then(result => {
        console.log(result)

        renderDialogsSlice(result)
    })


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
    // MTProto.invokeMethod("messages.sendMessage", {
    //     flags: 0,
    //     pFlags: {},
    //     peer: {
    //         _: "inputPeerUser",
    //         user_id: 196706924
    //     },
    //     message: "weeb'o gram",
    //     random_id: createNonce(8)
    // })
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

    if (AppPermanentStorage.exists("authorizationData")) {
        const authorizationData = AppPermanentStorage.getItem("authorizationData")
        authorizedStart(authorizationData)
        return;
    }

    MTProto.invokeMethod("help.getNearestDc").then(ndc => {
        setPhoneForm()
        // authorizedStart()

        document.getElementById("loginSendPhoneButton").addEventListener("click", event => {
            const phoneNumber = document.getElementById("loginPhoneNumberInput").value

            MTProto.invokeMethod("auth.sendCode", {
                flags: 0,
                // +9996601488
                phone_number: phoneNumber,
                api_id: AppConfiguration.mtproto.api.api_id,
                api_hash: AppConfiguration.mtproto.api.api_hash,
                settings: {
                    _: "codeSettings",
                    flags: 0,
                    pFlags: {
                        current_number: false,
                        allow_app_hash: false,
                        allow_flashcall: false
                    }
                },
                lang_code: navigator.language || 'en'
            }).then(response => {
                setCodeForm()

                // console.log(response)

                document.getElementById("loginSendCodeButton").addEventListener("click", event => {
                    const code = document.getElementById("loginCodeInput").value
                    const phoneCodeHash = response.phone_code_hash

                    MTProto.invokeMethod("auth.signIn", {
                        phone_number: phoneNumber,
                        phone_code_hash: phoneCodeHash,
                        phone_code: code
                    }).then(response => {
                        if (response._ === "auth.authorizationSignUpRequired") {
                            setSignUpForm()

                            document.getElementById("signUpButton").addEventListener("click", event => {
                                MTProto.invokeMethod("auth.signUp", {
                                    phone_number: phoneNumber,
                                    phone_code_hash: phoneCodeHash,
                                    first_name: document.getElementById("signUpFirstName").value,
                                    last_name: document.getElementById("signUpLastName").value
                                }).then(response => {
                                    if (response._ === "auth.authorization") {
                                        console.log(this)
                                        console.log("signup success!")
                                        authorizedStart(response)
                                    } else {
                                        console.log(response)
                                    }
                                })
                            })
                        } else {
                            authorizedStart(response)
                        }
                        // console.log(response)

                        // MTProto.invokeMethod("account.getAccountTTL").then(result => {
                        //     document.getElementById("app").innerHTML = JSON.stringify(result)
                        // })
                    }, error => {
                        switch (error.type) {
                            case "PHONE_CODE_EMPTY":
                            case "PHONE_CODE_EXPIRED":
                            case "PHONE_CODE_INVALID":
                                // Try again!
                                break
                            // 2FA
                            case "SESSION_PASSWORD_NEEDED":
                                password()
                                break
                        }
                    })
                })
            })
        })
    })
}

MTProto.connect(authContext)
    .then(start)
    .catch(error => {

        document.getElementById("app").innerHTML = `
    <h1>Error</h1>
    ${JSON.stringify(error)}
    <button onclick="location.reload()">Reload</button>
    `

    })