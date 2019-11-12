import {MTProto} from "../../../mtproto"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"

function phoneForm() {
    return `
        <form>
            <label for="phoneNumberInput">Phone</label>
            <input type="number" id="phoneNumberInput" value="9996621488" autofocus>
            
            <button id="sendCodeButton">Next</button>
        </form>
    `
}

function codeForm(sentType = "") {
    return `
        ${sentType}
            
        <form>
            <label for="phoneCodeInput">Code</label>
            <input type="number" id="phoneCodeInput" autofocus>
            
            <button id="signInButton">Sign In</button>
        </form>
    `
}

function signUpForm() {
    return `
        <form>
            <label for="signUpFirstName">First name</label>
            <input id="signUpFirstName">
            
            <label for="signUpLastName">Last name</label>
            <input id="signUpLastName">
            
            <button id="signUpButton">Sign Up</button>
        </form>
    `
}

export class LoginPage extends HTMLElement {
    constructor() {
        super();

        if (MTProto.isUserAuthorized()) {
            AppFramework.Router.push("/")
        }
    }

    submitPhoneForm(event) {
        event.preventDefault()

        const phoneNumber = document.getElementById("phoneNumberInput").value
        MTProto.invokeMethod("help.getNearestDc").then(ndc => {
            if (this.isNumberValid(phoneNumber)) {

                MTProto.Auth.sendCode(phoneNumber).then(sentCode => {
                    this.innerHTML = codeForm(sentCode.type._)

                    document.getElementById("signInButton").addEventListener("click", event => {
                        event.preventDefault()

                        const phoneCode = document.getElementById("phoneCodeInput").value
                        const phoneCodeHash = sentCode.phone_code_hash

                        MTProto.Auth.signIn(phoneNumber, phoneCodeHash, phoneCode).then(authorization => {
                            if (authorization._ === "auth.authorizationSignUpRequired") {
                                this.innerHTML = signUpForm()

                                document.getElementById("signUpButton").addEventListener("click", event => {

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
                            } else {
                                AppPermanentStorage.setItem("authorizationData", authorization)
                                AppFramework.Router.push("/")
                            }
                        })
                    })
                })
            }
        })
    }

    isNumberValid(number) {
        return number.length > 9
    }

    connectedCallback() {
        this.innerHTML = this.render()

        const loginSendPhoneButton = document.getElementById("sendCodeButton")
        loginSendPhoneButton.addEventListener("click", event => this.submitPhoneForm(event))
    }

    render() {
        return phoneForm()
    }
}