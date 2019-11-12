import {MTProto} from "../../../mtproto"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"

const VDOM = require("../../framework/vdom")


function vPhoneNumberFormTemplate(onSendHandler) {
    return (
        <form>
            <label htmlFor="phoneNumberInput">Phone</label>
            <input id="phoneNumberInput" type="number" autoFocus/>
            <button id="sendCodeButton" onClick={onSendHandler}>Next</button>
        </form>
    )
}

function vPhoneCodeFormTemplate(sentType, onSendHandler) {
    return (
        <div>
            {sentType}
            <br/>
            <form>
                <label htmlFor="phoneCodeInput">Code</label>
                <input id="phoneCodeInput" type="number" autoFocus/>
                <button id="signInButton" onClick={onSendHandler}>SignIn</button>
            </form>
        </div>
    )
}

function vSignUpFormTemplate(onSendHandler) {
    return (
        <form>
            <label htmlFor="signUpFirstName">First name</label>
            <input id="signUpFirstName" type="text" autoFocus/>

            <label htmlFor="signUpLastName">Last name</label>
            <input id="signUpLastName" type="text"/>

            <button id="signUpButton" onClick={onSendHandler}>SignUp</button>
        </form>
    )
}

export class LoginPage extends HTMLElement {
    constructor(opts) {
        super();

        if (MTProto.isUserAuthorized()) {
            AppFramework.Router.push("/")
        }

        this.vNode = VDOM.h("div", {
            children: [
                "wait.."
            ]
        })
    }

    initVNode() {
        this.vNode = vPhoneNumberFormTemplate(event => {
            event.preventDefault()

            const phoneNumber = document.getElementById("phoneNumberInput").value

            if (this.isNumberValid(phoneNumber)) {

                MTProto.Auth.sendCode(phoneNumber).then(sentCode => {

                    this.vNode = vPhoneCodeFormTemplate(sentCode.type._, event => {
                        event.preventDefault()

                        const phoneCode = document.getElementById("phoneCodeInput").value
                        const phoneCodeHash = sentCode.phone_code_hash

                        MTProto.Auth.signIn(phoneNumber, phoneCodeHash, phoneCode).then(authorization => {
                            if (authorization._ === "auth.authorizationSignUpRequired") {
                                this.vNode = vSignUpFormTemplate(event => {
                                    event.preventDefault()

                                    const firstName = document.getElementById("signUpFirstName").value
                                    const lastName = document.getElementById("signUpLastName").value

                                    MTProto.Auth.signUp(phoneNumber, phoneCodeHash, firstName, lastName).then(authorization => {
                                        if (authorization._ === "auth.authorization") {
                                            console.log(this)
                                            console.log("signup success!")
                                            AppPermanentStorage.setItem("authorizationData", authorization)
                                            AppFramework.Router.push("/")
                                        } else {
                                            console.log(authorization)
                                        }
                                    })
                                })

                                this.render()
                            } else {
                                AppPermanentStorage.setItem("authorizationData", authorization)
                                AppFramework.Router.push("/")
                            }
                        })
                    })

                    this.render()
                })
            }
        })

        this.render()
    }

    isNumberValid(number) {
        return number.length > 9
    }

    connectedCallback() {
        MTProto.invokeMethod("help.getNearestDc").then(ndc => {
            this.initVNode()
            this.render()
        })
    }

    render() {
        this.innerHTML = ""
        if (this.vNode) {
            this.appendChild(VDOM.render(this.vNode))
        }
    }
}