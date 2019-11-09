import {MTProto} from "./mtproto"
import {createNonce} from "./mtproto/utils/bin"
import {createLogger} from "./common/logger";
import {setCodeForm, setPhoneForm} from "./ui/login/loginPage"
import CONFIG from "./configuration"

const Logger = createLogger("main")

window.mtprotoStorage = {}

const authContext = {
    dcID: 0,
    nonce: createNonce(16),
    sessionID: createNonce(8) // TODO check if secure?
}

function start() {
    MTProto.invokeMethod("help.getNearestDc").then(ndc => {
        Logger.debug("nearestDc = ", ndc)

        setPhoneForm()

        document.getElementById("loginSendPhoneButton").addEventListener("click", event => {
            const phoneNumber = document.getElementById("loginPhoneNumberInput").value

            MTProto.invokeMethod("auth.sendCode", {
                flags: 0,
                // +9996601488
                phone_number: phoneNumber,
                api_id: CONFIG.mtproto.api.api_id,
                api_hash: CONFIG.mtproto.api.api_hash,
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

                console.log(response)

                document.getElementById("loginSendCodeButton").addEventListener("click", event => {
                    const code = document.getElementById("loginCodeInput").value

                    MTProto.invokeMethod("auth.signIn", {
                        phone_number: phoneNumber,
                        phone_code_hash: response.phone_code_hash,
                        phone_code: code
                    }).then(response => {
                        console.log(response)

                        MTProto.invokeMethod("account.getAccountTTL").then(result => {
                            document.getElementById("app").innerHTML = JSON.stringify(result)
                        })
                    })
                })
            })
        })
    })

}

MTProto.connect(authContext).then(start)