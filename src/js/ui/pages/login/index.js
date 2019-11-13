import {MTProto} from "../../../mtproto"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"

const VDOM = require("../../framework/vdom")

function vLoginPageTemplate(options) {
    return (
        <div class="grid login-grid">
            <img class="logo" src="/images/icons/logo.svg"/>
            <div class="login-text-block text-center">
                <div class="login-text-header">{options.header}</div>
                <div class="login-text-description">{options.description}</div>
            </div>
            {options.form}
            {options.button}
        </div>
    )
}

function vPhoneNumberFormTemplate(onSendHandler) {
    return vLoginPageTemplate({
        form: (<div class="inputs">
                <div class="relative-block">
                    <div class="relative-block">
                        <input class="default-input country-selector floating-label-field" type="text" id="country"
                               placeholder="Country" style="background-image: url('/images/icons/down_svg.svg');"/>
                        <label class="floating-label" for="country">Country</label>
                    </div>
                    <div id="country-list" class="country-selector-container flex-column hide-block">

                    </div>
                </div>
                <div class="relative-block">
                    <input class="default-input floating-label-field" type="tel" id="number"
                           placeholder="Phone Number"/><label class="floating-label" for="number">Phone
                    Number</label>
                </div>
                <div class="checkbox-input">
                    <label><input type="checkbox" name="keep_logger"/><span class="checkmark"/></label><span
                    class="checkbox-label">Keep me signed in</span>
                </div>
            </div>
        ),
        button: (
            <button class="ripple next-button" onClick={onSendHandler}>Next</button>
        ),
        header: "Sign in to Telegram",
        description: "Please confirm your country and enter your phone number."
    })
}

function vPhoneCodeFormTemplate(phoneNumber, sentType, onSendHandler) {
    return vLoginPageTemplate({
        form: (
            <div class="inputs">
                <div class="relative-block">
                    <input class="default-input floating-label-field" type="text" id="code"
                           placeholder="Code" onInput={onSendHandler}/><label class="floating-label" for="code">Code</label>
                </div>
            </div>
        ),
        button: "",
        header: (
            <span>{phoneNumber} EDIT_HERE</span>
        ),
        description: "We have sent you an SMS with the code."
    })
}

function vSignUpFormTemplate(onSendHandler) {
    return (
        <form>
            <label for="signUpFirstName">First name</label>
            <input id="signUpFirstName" type="text" autoFocus/>

            <label for="signUpLastName">Last name</label>
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

            const phoneNumber = document.getElementById("number").value

            if (this.isNumberValid(phoneNumber)) {

                MTProto.Auth.sendCode(phoneNumber).then(sentCode => {
                    console.log(sentCode)

                    this.vNode = vPhoneCodeFormTemplate(phoneNumber, sentCode.type._, event => {
                        if(!/[0-9]*/.test(event.target.value)) {
                            event.preventDefault()
                            return
                        }
                        if(!this.isCodeValid(event.target.value)) return;


                        const phoneCode = document.getElementById("code").value
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

    isCodeValid(code) {
        return /^\d{5}$/.test(code)
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