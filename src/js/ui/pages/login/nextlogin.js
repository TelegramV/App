import {MonkeyController} from "./monkey"
import {askForFile, countries, hasClass} from "../../utils"
import {MTProto} from "../../../mtproto"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"
import {FileAPI} from "../../../api/fileAPI"
import AppCryptoManager from "../../../mtproto/crypto/cryptoManager"
import {DropdownComponent} from "../main/components/input/dropdownComponent";
import {InputComponent} from "../main/components/input/inputComponent";
import CheckboxComponent from "../main/components/input/checkboxComponent";
import {ButtonWithProgressBarComponent} from "../main/components/input/buttonComponent";
import Component from "../../framework/vrdom/component";
import AppConfiguration from "../../../configuration";
import UpdatesManager from "../../../api/updates/updatesManager";
import {tsNow} from "../../../mtproto/timeManager";
import {defaultDcID} from "../../../application";
import {ModalComponent, ModalManager} from "../../modalManager";

const Croppie = require("croppie")
const QRCodeStyling = require("qr-code-styling")
const Emoji = require("emoji-js");
let emoji = new Emoji();

let cropperEl
let cropper;
let pictureBlob;


function successfulAuth() {
    if (!document.getElementById("keepLogger").checked) {

        window.addEventListener("beforeunload", function (e) {
            AppPermanentStorage.clear() // tODO move this to proper place
        }, false);
    }
}

function generateFullDropdown() {
    return countries.map(l => {
        return {
            flag: emoji.replace_colons(":flag-" + l[2].toLowerCase() + ":"),
            name: l[1],
            code: l[0]
        }
    })
}

function initModals() {
    Array.from(document.querySelectorAll(".modal")).forEach(function (element) {
        element.addEventListener("click", function (e) {
            if (e.target == e.currentTarget) {
                hideModal();
            }
        });
        element.querySelector(".close-button").addEventListener("click", hideModal);
    });
}

function showModal(modal) {
    modal.classList.remove("hidden");
}

function hideModal() {
    Array.from(document.querySelectorAll(".modal:not(.hidden)")).forEach(function (element) {
        element.classList.add("hidden");
    });
}


const InfoComponent = ({header, description}) => {
    return (
        <div className="info">
            <div className="header">{header}</div>
            <div className="description">{description}</div>
        </div>
    )
}

function CountryDropdownItemComponent({flag, name, code}) {
    return <div className="dropdown-item">
        <div className="country-flag" dangerouslySetInnerHTML={flag}></div>
        <div className="country-name">{name}</div>
        <div className="country-code">{code}</div>
    </div>
}

class PaneComponent extends Component {
    constructor(props) {
        super(props)
    }

    set isShown(value) {
        this.state.isShown = value
        this.__patch()
    }
}

class PhoneInputComponent extends PaneComponent {
    constructor(props) {
        super(props)

        this.state = {
            country: null,
            isLoading: false,
            nextDisabled: true
        }
    }

    h() {
        let classList = ["fading-block"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        }
        return (
            <div id="phonePane" className={classList.join(" ")}>
                <img className="object" src="./static/images/logo.svg" alt=""
                     onClick={this.props.finished}/>
                <InfoComponent header="Sign in to Telegram"
                               description="Please confirm your country and enter your phone number"/>
                <DropdownComponent label="Country" data={generateFullDropdown()}
                                   template={CountryDropdownItemComponent} selected={this.onDropdownSelect}
                                   ref="dropdown"/>
                <InputComponent label="Phone Number" type="tel"
                                filter={value => /^\+?[\d ]*$/.test(value)} input={this.phoneInput} ref="phone"/>
                <CheckboxComponent label="Keep me signed in" id="keepLogger" checked/>
                <ButtonWithProgressBarComponent label="Next" disabled={this.state.nextDisabled}
                                                click={this.handlePhoneSend} ref="next"/>
                <div className="qr-login-button" onClick={this.qrLogin}>Quick log in using QR code</div>
            </div>
        )
    }

    qrLogin(ev) {

        MTProto.invokeMethod("auth.exportLoginToken", {
            api_id: AppConfiguration.mtproto.api.api_id,
            api_hash: AppConfiguration.mtproto.api.api_hash,
            except_ids: []
        }).then(l => {
            this.props.qrLoginInit(l)
        })
    }

    handlePhoneSend() {
        if (this.state.isLoading) return
        this.state.isLoading = true

        const phone = this.refs.get("phone")
        const next = this.refs.get("next")
        const phoneNumber = phone.getValue()

        next.isLoading = true
        next.label = "Please wait..."

        MTProto.Auth.sendCode(phoneNumber).then(sentCode => {
            this.props.finished({
                phone: phoneNumber,
                sentCode: sentCode
            })


            // fadeOut(document.getElementById("phonePane"));
            // fadeIn(document.getElementById("codePane"));
            //
            // let phone = document.getElementById("phonePreview");
            // if (phone.firstChild.tagName.toLowerCase() === "span") {
            //     phone.removeChild(phone.firstChild);
            // }
            // let text = document.createElement("span");
            // text.textContent = $phoneInput.value;
            // phone.prepend(text);
            // _formData.phoneNumber = phoneNumber
            // _formData.sentCode = sentCode
        }, error => {
            if (error.type === "AUTH_RESTART") {
                AppPermanentStorage.clear()
                this.handlePhoneSend()
                return
            }
            const msg = {
                PHONE_NUMBER_INVALID: "Invalid phone number",
                PHONE_NUMBER_BANNED: "Phone number is banned",
                PHONE_NUMBER_FLOOD: "Too many attempts",
                AUTH_RESTART: "Auth restarting"
            }[error.type] || "Error occured"
            this.refs.get("phone").error = msg
        }).finally(l => {
            this.state.isLoading = false
            next.isLoading = false
            next.label = "Next"
        })
    }

    phoneInput(ev) {
        // Add + if entering a number
        if(defaultDcID === 0) { // test dc
            this.state.nextDisabled = false
            this.refs.get("next").setDisabled(false)
            return true
        }
        if (!ev.target.value.startsWith("+") && ev.target.value.length > 0) {
            ev.target.value = "+" + ev.target.value
        }
        if (ev.target.value.length > 1) {
            for (let i in countries) {
                const country = countries[i]
                if (ev.target.value.replace(" ", "").startsWith(country[0].replace(" ", ""))) {
                    this.state.country = i
                    this.refs.get("dropdown").select(i)
                    break
                }
            }
        }
        if (this.state.country) {
            // length without +380
            const numberLength = ev.target.value.replace(" ", "").length - countries[this.state.country][0].replace(" ", "").length
            if (numberLength >= 9) {
                this.state.nextDisabled = false
                this.refs.get("next").setDisabled(false)
                return true
            }
        }
        this.state.nextDisabled = true
        this.refs.get("next").setDisabled(true)
        return true
    }

    onDropdownSelect(value) {
        const phone = this.refs.get("phone")
        phone.setValue(value.code)
    }
}

class CodeInputComponent extends PaneComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    h() {

        let classList = ["fading-block"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        }

        return <div id="subCodePane" className={classList.join(" ")}>

            <div className="info">
                <div className="header"><span>{this.state.phone}</span><i className="btn-icon rp rps tgico tgico-edit"
                                                                          onClick={this.props.cancel}/>
                </div>
                <div className="description">We have sent you an SMS with the code.</div>
            </div>
            <InputComponent label="Code" type="text" filter={value => /^[\d]{0,5}$/.test(value)} input={this.onInput}
                            ref="codeInput"/>
        </div>
    }

    setData(ev) {
        this.state.phone = ev.phone
        this.state.sentCode = ev.sentCode
        this.__patch()
    }

    onInput(ev) {
        if (this.isLoading) return false
        this.props.monkeyLook(ev.target.value.length)
        if (ev.target.value.length === 5) {
            this.handleSignIn(ev.target.value)
        }
        return true
    }

    handleSignIn(phoneCode) {
        const phoneCodeHash = this.state.sentCode.phone_code_hash
        this.isLoading = true

        //this.state.phoneCode = phoneCode
        //this.state.phoneCodeHash = phoneCodeHash

        MTProto.Auth.signIn(this.state.phone, phoneCodeHash, phoneCode).then(authorization => {
            if (authorization._ === "auth.authorizationSignUpRequired") {
                // show sign up
                //fadeOut(document.getElementById("codePane"));
                //fadeIn(document.getElementById("registerPane"));
                this.props.signUp({
                    phoneCodeHash: phoneCodeHash,
                    phone: this.state.phone
                })
                return
            } else {
                this.props.finished(authorization)
                return
            }
        }, reject => {
            if (reject.type === "SESSION_PASSWORD_NEEDED") {
                MTProto.invokeMethod("account.getPassword", {}).then(response => {
                    console.log(response)
                    this.props.password(response)
                    /*if (response._ !== "passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow") {
                        throw new Error("Unknown 2FA algo")
                    }*/
                    //console.log(response)
                    //setCode2FAForm()

                    //fadeOut(document.getElementById("subCodePane"));
                    //fadeIn(document.getElementById("passwordPane"));
                    //_formData.passwordData = response
                })
            } else {
                this.refs.get("codeInput").error = "Invalid code"
            }
        }).finally(l => {
            this.isLoading = false
        })
    }
}


class PasswordInputComponent extends PaneComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    h() {
        let classList = ["fading-block"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        } else {
            classList.push("hidden");
        }

        return <div id="passwordPane" className={classList.join(" ")}>
            <InfoComponent header="Enter a Password"
                           description="Your account is protected with an additional password."/>

            <InputComponent label={"Hint: " + (this.state.response ? this.state.response.hint : "")} type="password"
                            hide ref="passwordInput" peekChange={this.onPeekChange}/>


            <ButtonWithProgressBarComponent label="Next" click={this.handlePasswordSend} ref="nextPassword"/>
        </div>
    }

    onPeekChange(e) {
        this.props.monkeyPeek(e)
    }

    setData(ev) {
        this.props.monkeyClose()
        this.state.response = ev
        this.__patch()
    }

    async handlePasswordSend() {
        if (this.state.isLoading) return
        this.state.isLoading = true

        const passwordInput = this.refs.get("passwordInput")
        const next = this.refs.get("nextPassword")
        const password = passwordInput.getValue()

        next.isLoading = true
        next.label = "Please wait..."

        const response = this.state.response
        const salt1 = response.current_algo.salt1
        const salt2 = response.current_algo.salt2
        const g = response.current_algo.g
        const p = response.current_algo.p
        const srp_id = response.srp_id
        const srp_B = response.srp_B

        const srp_ret = await AppCryptoManager.srpCheckPassword(g, p, salt1, salt2, srp_id, srp_B, password);

        MTProto.invokeMethod("auth.checkPassword", {
            password: {
                _: "inputCheckPasswordSRP",
                srp_id: srp_ret.srp_id,
                A: srp_ret.A,
                M1: srp_ret.M1
            }
        }).then(response => {
            // resetNextButton($passwordNext)
            // console.log(response);
            //
            this.props.finished(response)
            //authorizedStart(response)
        }, reject => {
            // console.log(reject)
            // $phoneInput.classList.add("invalid");
            //
            if (reject.type === "INVALID_PASSWORD_HASH") {
                this.refs.get("passwordInput").error = "Invalid password"
            } else {
                this.refs.get("passwordInput").error = reject.type
            }

        }).finally(l => {
            this.state.isLoading = false
            next.isLoading = false
            next.label = "Next"
        })
    }
}

class CodeAndPasswordPaneComponent extends PaneComponent {
    constructor(props) {
        super(props);
        this.state = {
            monkey: new MonkeyController()
        }
    }

    h() {
        let classList = ["fading-block"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        } else {
            classList.push("hidden");
        }

        return <div className={classList.join(" ")}>
            <tgs-player id="monkey" className="object"/>
            <CodeInputComponent ref="code" cancel={this.props.cancelCode} finished={this.props.finished}
                                password={this.onPassword}
                                monkeyLook={this.state.monkey.monkeyLook.bind(this.state.monkey)} signUp={this.props.signUp}/>
            <PasswordInputComponent ref="password" finished={this.props.finished}
                                    monkeyClose={this.state.monkey.close.bind(this.state.monkey)}
                                    monkeyPeek={this.monkeyPeek}/>
        </div>
    }

    monkeyPeek(e) {
        if (e) {
            this.state.monkey.peek()
        } else {
            this.state.monkey.open()
        }
    }

    open() {
        this.state.monkey.init(document.getElementById("monkey"))
        this.state.monkey.reset()
        this.state.monkey.stop()
    }

    onPassword(ev) {
        this.refs.get("password").setData(ev)
        this.props.password(ev)
    }
}

class RegisterPaneComponent extends PaneComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    h() {
        let classList = ["fading-block", "registerPane"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        } else {
            classList.push("hidden");
        }

        return <div className={classList.join(" ")}>
            <div id="picture" className="object picture rp rps" onClick={this.addPicture}>
                <div className="tint hidden"/>
                <i className="add-icon tgico tgico-cameraadd"/></div>
            <InfoComponent header="Your name" description="Enter your name and add a profile picture"/>

            <InputComponent label="Name" type="text" ref="firstNameInput"/>
            <InputComponent label="Last Name (Optional)" type="text" ref="lastNameInput"/>

            <ButtonWithProgressBarComponent label="Start Messaging" click={this.handleSignUp} ref="nextSignUp"/>

        </div>
    }

    initCropper() {
        this.state.cropper = new Croppie(document.querySelector("#cropper"), {
            enableExif: true,
            showZoomer: false,
            viewport: {
                width: 310,
                height: 310,
                type: 'circle'
            },
            boundary: {
                width: 350,
                height: 350
            }
        });
    }

    addPictureConfirm() {
        this.state.cropper.result({
            type: 'base64'
        }).then(function (base) {
            const bytes = Uint8Array.from(atob(base.split(",")[1]), c => c.charCodeAt(0))
            console.log(bytes, base)
            this.state.pictureBlob = bytes;
            let blob = new Blob([bytes], {type: "image/png"});
            console.log(blob)
            const url = URL.createObjectURL(blob);
            const picture = this.$el.querySelector("#picture");
            picture.style.backgroundImage = 'url("' + url + '")';
            picture.querySelector(".tint").classList.remove("hidden");

            ModalManager.close()
        }.bind(this));
    }

    addPicture() {
        askForFile("image/*", function (file) {
            ModalManager.open("Drag to Reposition",
                <div id="cropperModal" className="body">
                    <div id="cropper">
                    </div>
                    <div className="done-button rp" onClick={this.addPictureConfirm}><i className="tgico tgico-check"/></div>
                </div>)
            this.initCropper()

            this.state.cropper.bind({
                url: file
            });

        }.bind(this))
    }

    setData(ev) {
        console.log(ev)
        this.state.phone = ev.phone
        this.state.phoneCodeHash = ev.phoneCodeHash
    }

    handleSignUp() {
        if (this.state.isLoading) return
        this.state.isLoading = true

        const firstNameInput = this.refs.get("firstNameInput")
        const lastNameInput = this.refs.get("lastNameInput")
        const next = this.refs.get("nextSignUp")
        const firstName = firstNameInput.getValue()
        const lastName = lastNameInput.getValue()

        next.isLoading = true
        next.label = "Please wait..."

        MTProto.Auth.signUp(this.state.phone, this.state.phoneCodeHash, firstName, lastName).then(async authorization => {
            if (authorization._ === "auth.authorization") {
                if (this.state.pictureBlob) {
                    FileAPI.uploadProfilePhoto("avatar.jpg", this.state.pictureBlob).then(l => {
                        console.log("WOW finished", l)
                        this.props.finished(authorization)
                    }, error => {
                        console.log(error)
                        AppFramework.Router.push("/")
                    });
                } else {
                    this.props.finished(authorization)
                }
            } else {
                console.log(authorization)
            }
        }, error => {
            if (error.type === "FIRSTNAME_INVALID") {
                firstNameInput.error = "Invalid first name"
            } else if (error.type === "LASTNAME_INVALID") {
                lastNameInput.error = "Invalid last name"
            } else {
                firstNameInput.error = error.type
            }
            console.log(error)
        }).finally(l => {
            this.state.isLoading = false
            next.isLoading = false
            next.label = "Start Messaging"
        })
    }
}

class QrLoginPaneComponent extends PaneComponent {
    constructor(props) {
        super(props);
        MTProto.UpdatesManager.subscribe("updateLoginToken", l => {
            MTProto.invokeMethod("auth.exportLoginToken", {
                api_id: AppConfiguration.mtproto.api.api_id,
                api_hash: AppConfiguration.mtproto.api.api_hash,
                except_ids: []
            }).then(l => {
                this.open(l)
            })
        })
    }

    h() {
        let classList = ["fading-block"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        } else {
            classList.push("hidden");
        }
        return (
            <div className={classList.join(" ")}>
                <div className="object big" />
                <InfoComponent header="Scan from mobile Telegram"
                               description={<ol>
                                   <li>Open Telegram on your phone</li>
                                   <li>Go to Settings -> Devices -> Scan QR Code</li>
                                   <li>Scan this image to Log In</li>
                               </ol>}/>
                <div className="qr-login-button" onClick={this.props.backToPhone}>Or log in using your phone number</div>


            </div>
        )
    }

    open(l) {
        // TODO recreate QR when expired
        // TODO multiple DCs
        if(l._ === "auth.loginTokenSuccess") {
            this.props.finished(l.authorization)
            return
        }
        console.log(l)
        const b64encoded = btoa(String.fromCharCode.apply(null, l.token)).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '')
        const string = "tg://login?token=" + b64encoded
        console.log(string)
        const qrCode = new QRCodeStyling({
            width: 240,
            height: 240,
            data: string,
            image: "./static/images/logo.svg",
            dotsOptions: {
                color: "#000000",
                type: "rounded"
            },
            imageOptions: {
                imageSize: 0.5
            },
            backgroundOptions: {
                color: "#ffffff",
            },
            qrOptions: {
                errorCorrectionLevel: "L"
            }
        })

        const obj = this.$el.querySelector(".object")
        if(obj.firstChild) obj.removeChild(obj.firstChild)
        setTimeout(l => {
            obj.appendChild(qrCode._canvas._canvas)
        }, 0)
        console.log(l.expires - tsNow(true))
        setTimeout(l => {
            if(MTProto.isUserAuthorized()) return
            MTProto.invokeMethod("auth.exportLoginToken", {
                api_id: AppConfiguration.mtproto.api.api_id,
                api_hash: AppConfiguration.mtproto.api.api_hash,
                except_ids: []
            }).then(l => {
                this.open(l)
            })
        }, 1000 * (l.expires - tsNow(true)))
    }
}


class Login extends Component {
    constructor(props) {
        super(props);

    }

    h() {
        return (
            <div id="login">
                <PhoneInputComponent finished={this.handleSendCode} ref="phonePane" qrLoginInit={this.qrLoginInit}/>
                <CodeAndPasswordPaneComponent ref="codeAndPassword" cancelCode={this.cancelCode}
                                              password={this.password} finished={this.loginSuccess} signUp={this.signUp}/>
                <QrLoginPaneComponent ref="qrLoginPane" finished={this.loginSuccess} backToPhone={this.backToPhone}/>
                <RegisterPaneComponent ref="registerPane" finished={this.loginSuccess}/>
            </div>
        )
    }

    backToPhone(l) {
        this.fadeOut(this.refs.get("qrLoginPane"));
        this.fadeIn(this.refs.get("phonePane"));
    }

    qrLoginInit(l) {
        this.refs.get("qrLoginPane").open(l)

        this.fadeOut(this.refs.get("phonePane"));
        this.fadeIn(this.refs.get("qrLoginPane"));
    }

    loginSuccess(response) {
        AppPermanentStorage.setItem("authorizationData", response)
        AppFramework.Router.push("/")
        console.log("login success!")
    }

    signUp(ev) {
        this.refs.get("registerPane").setData(ev)

        this.fadeIn(this.refs.get("registerPane"));
        this.fadeOut(this.refs.get("codeAndPassword"));
    }

    password() {
        this.fadeOut(this.refs.get("codeAndPassword").refs.get("code"));
        this.fadeIn(this.refs.get("codeAndPassword").refs.get("password"));
    }

    cancelCode() {
        this.fadeIn(this.refs.get("phonePane"));
        this.fadeOut(this.refs.get("codeAndPassword"));
    }

    handleSendCode(ev) {
        this.refs.get("codeAndPassword").open()

        this.refs.get("codeAndPassword").refs.get("code").setData(ev)
        this.fadeOut(this.refs.get("phonePane"));
        this.fadeIn(this.refs.get("codeAndPassword"));
    }


    fadeOut(elem) {
        elem.isShown = false
    }

    fadeIn(elem) {
        elem.isShown = true
    }
}

export function LoginPage() {
    return (
        <div>
            <ModalComponent/>
            <Login/>
            <div style="position: absolute; bottom: 0; right: 0;">
                <button onClick={l => {
                    AppPermanentStorage.clear() + window.location.reload()
                }}>clear auth
                </button>
            </div>
        </div>
    )
}