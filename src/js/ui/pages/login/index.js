import {MTProto} from "../../../mtproto"

import {FrameworkComponent} from "../../framework/component"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"

export class LoginPage extends FrameworkComponent {
    constructor(props = {}) {
        super()
        this.formData = {}
    }

    data() {
        return {
            form: "phone"
        }
    }

    isNumberValid(number) {
        return number.length > 9
    }

    isCodeValid(code) {
        return /^\d{5}$/.test(code)
    }

    handlePhoneSend() {
        return event => {
            event.preventDefault()

            const phoneNumber = document.getElementById("number").value

            if (this.isNumberValid(phoneNumber)) {

                MTProto.Auth.sendCode(phoneNumber).then(sentCode => {
                    this.formData.phoneNumber = phoneNumber
                    this.formData.sentCode = sentCode
                    this.reactive.form = "code"
                })
            }
        }
    }

    handleSignIn() {
        return event => {
            if (!/[0-9]*/.test(event.target.value)) {
                event.preventDefault()
                return
            }

            if (!this.isCodeValid(event.target.value)) return;

            const phoneCode = document.getElementById("code").value
            const phoneCodeHash = this.formData.sentCode.phone_code_hash

            this.formData.phoneCode = phoneCode
            this.formData.phoneCodeHash = phoneCodeHash

            MTProto.Auth.signIn(this.formData.phoneNumber, phoneCodeHash, phoneCode).then(authorization => {
                if (authorization._ === "auth.authorizationSignUpRequired") {
                    this.reactive.form = "singup"
                } else {
                    AppPermanentStorage.setItem("authorizationData", authorization)
                    AppFramework.Router.push("/")
                }
            })
        }
    }

    handleSignUp() {
        return event => {
            event.preventDefault()

            const firstName = document.getElementById("signUpFirstName").value
            const lastName = document.getElementById("signUpLastName").value

            MTProto.Auth.signUp(this.formData.phoneNumber, this.formData.phoneCodeHash, firstName, lastName).then(authorization => {
                if (authorization._ === "auth.authorization") {
                    console.log(this)
                    console.log("signup success!")
                    AppPermanentStorage.setItem("authorizationData", authorization)
                    AppFramework.Router.push("/")
                } else {
                    console.log(authorization)
                }
            })
        }
    }

    h({reactive, h}) {
        if (!reactive.form) {
            return (
                <div className="grid login-grid">
                    <img className="logo" src="/static/images/icons/logo.svg"/>
                    <div className="login-text-block text-center">
                        <div className="login-text-header">Telegram</div>
                        <div className="login-text-description">Loading..</div>
                    </div>
                </div>
            )
        } else if (reactive.form === "phone") {
            return (
                <div className="grid login-grid">
                    <img className="logo" src="/static/images/icons/logo.svg"/>
                    <div className="login-text-block text-center">
                        <div className="login-text-header">Sign in to Telegram</div>
                        <div className="login-text-description">
                            Please confirm your country and enter your phone number.
                        </div>
                    </div>
                    <div className="inputs">
                        <div className="relative-block">
                            <div className="relative-block">
                                <input className="default-input country-selector floating-label-field" type="text"
                                       id="country"
                                       placeholder="Country"
                                       style="background-image: url('/static/images/icons/down_svg.svg');"/>
                                <label className="floating-label" htmlFor="country">Country</label>
                            </div>
                            <div id="country-list" className="country-selector-container flex-column hide-block">

                            </div>
                        </div>
                        <div className="relative-block">
                            <input className="default-input floating-label-field" type="tel" id="number"
                                   placeholder="Phone Number" required="true"/><label className="floating-label"
                                                                                      htmlFor="number">Phone
                            Number</label>
                        </div>
                        <div className="checkbox-input">
                            <label><input type="checkbox" name="keep_logger"/><span
                                className="checkmark"/></label><span
                            className="checkbox-label">Keep me signed in</span>
                        </div>
                    </div>
                    <button className="ripple next-button" onClick={this.handlePhoneSend()}>Next</button>
                </div>
            )
        } else if (reactive.form === "code") {
            return (
                <div className="grid login-grid">
                    <img className="logo" src="/static/images/icons/logo.svg"/>
                    <div className="login-text-block text-center">
                        <div className="login-text-header">{this.formData.phoneNumber} EDIT_HERE</div>
                        <div className="login-text-description">
                            We have sent you an SMS with the code.
                        </div>
                    </div>
                    <div className="inputs">
                        <div className="relative-block">
                            <input className="default-input floating-label-field" type="text" id="code"
                                   placeholder="Code" onInput={this.handleSignIn()}/><label
                            className="floating-label"
                            htmlFor="code">Code</label>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <form>
                    <label htmlFor="signUpFirstName">First name</label>
                    <input id="signUpFirstName" type="text" autoFocus/>

                    <label htmlFor="signUpLastName">Last name</label>
                    <input id="signUpLastName" type="text"/>

                    <button id="signUpButton" onClick={this.handleSignUp()}>SignUp</button>
                </form>
            )
        }
    }
}