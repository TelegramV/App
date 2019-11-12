import {MTProto} from "../../../mtproto"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"
import VDOM from "../../framework/vdom"

function vPhoneNumberFormTemplate(onSendHandler) {
    return VDOM.h("form", {
        children: [
            VDOM.h("label", {
                attrs: {
                    for: "phoneNumberInput"
                },
                children: "Phone"
            }),
            VDOM.h("input", {
                attrs: {
                    type: "number",
                    id: "phoneNumberInput",
                    autofocus: true,
                },
            }),
            VDOM.h("button", {
                attrs: {
                    id: "sendCodeButton",
                },
                events: {
                    click: onSendHandler
                },
                children: "Next"
            }),
        ]
    })
}

function vPhoneCodeFormTemplate(sentType, onSendHandler) {
    return VDOM.h("div", {
        children: [
            sentType,
            VDOM.h("br"),
            VDOM.h("form", {
                children: [
                    VDOM.h("label", {
                        attrs: {
                            for: "phoneCodeInput"
                        },
                        children: "Code"
                    }),
                    VDOM.h("input", {
                        attrs: {
                            type: "number",
                            id: "phoneCodeInput",
                            autofocus: true,
                        },
                    }),
                    VDOM.h("button", {
                        attrs: {
                            id: "signInButton",
                        },
                        events: {
                            click: onSendHandler
                        },
                        children: "SignIn"
                    }),
                ]
            })
        ]
    })
}

function vSignUpFormTemplate(onSendHandler) {
    return VDOM.h("form", {
        children: [
            VDOM.h("label", {
                attrs: {
                    for: "signUpFirstName"
                },
                children: "First name"
            }),
            VDOM.h("input", {
                attrs: {
                    type: "text",
                    id: "signUpFirstName",
                    autofocus: true,
                },
            }),
            VDOM.h("label", {
                attrs: {
                    for: "signUpLastName"
                },
                children: "Last name"
            }),
            VDOM.h("input", {
                attrs: {
                    type: "text",
                    id: "signUpLastName",
                    autofocus: true,
                },
            }),

            VDOM.h("button", {
                attrs: {
                    id: "signUpButton",
                },
                events: {
                    click: onSendHandler
                },
                children: "SignUp"
            }),
        ]
    })
}

export class LoginPage extends HTMLElement {
    constructor() {
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