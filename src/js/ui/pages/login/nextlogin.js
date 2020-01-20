import {MonkeyController} from "./monkey"
import {countries, hasClass} from "../../utils"
import {MTProto} from "../../../mtproto"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"
import {FileAPI} from "../../../api/fileAPI"
import AppCryptoManager from "../../../mtproto/crypto/cryptoManager"
import {DropdownComponent} from "../main/components/input/dropdownComponent";
import {InputComponent} from "../main/components/input/inputComponent";
import {CheckboxComponent} from "../main/components/input/checkboxComponent";
import {ButtonWithProgressBarComponent} from "../main/components/input/buttonComponent";
import Component from "../../framework/vrdom/component";

const Croppie = require("croppie")
const Emoji = require("emoji-js");
let emoji = new Emoji();

let $countryInput = null
let $list = null
let $openDropdown = null
let $parent = null
let $phoneInput = null
let $codeInput = null
let $passwordInput = null
let $peekBtn = null
let $passwordNext = null
let cropperEl
let cropper;
let pictureBlob;

let Monkey = null

let _formData = {}

function isNumberValid(number) {
    return number.length > 9
}

function isCodeValid(code) {
    return /^\d{5}$/.test(code)
}

function resetNextButton(button, text = "NEXT") {
    button.querySelector("span").innerHTML = text
    button.querySelector("progress").style.display = "none"
    button.dataset.loading = "0"
}

function handlePhoneSend() {
    return event => {
        event.preventDefault()
        if (document.getElementById("next").disabled || document.getElementById("next").dataset.loading === "1") return

        const phoneNumber = $phoneInput.value
        document.querySelector("#next span").innerHTML = "PLEASE WAIT..."
        document.querySelector("#next progress").style.display = "block"
        document.getElementById("next").dataset.loading = "1"

        if (isNumberValid(phoneNumber)) {

            MTProto.Auth.sendCode(phoneNumber).then(sentCode => {
                resetNextButton(document.getElementById("next"))

                fadeOut(document.getElementById("phonePane"));
                fadeIn(document.getElementById("codePane"));

                let phone = document.getElementById("phonePreview");
                if (phone.firstChild.tagName.toLowerCase() === "span") {
                    phone.removeChild(phone.firstChild);
                }
                let text = document.createElement("span");
                text.textContent = $phoneInput.value;
                phone.prepend(text);
                _formData.phoneNumber = phoneNumber
                _formData.sentCode = sentCode
            }, error => {
                const messages = {
                    PHONE_NUMBER_INVALID: "Invalid phone number",
                    PHONE_NUMBER_BANNED: "Phone number is banned",
                    PHONE_NUMBER_FLOOD: "Too many attempts",
                    AUTH_RESTART: "Auth restarting"
                }
                if (error.type === "AUTH_RESTART") {
                    window.location.reload() // TODO should probably save session state
                }
                const msg = messages[error.type] || "Error occured"
                $phoneInput.classList.add("invalid");
                $phoneInput.nextElementSibling.innerHTML = msg;
                resetNextButton(document.getElementById("next"))
            })
        } else {

            $phoneInput.classList.add("invalid");
            $phoneInput.nextElementSibling.innerHTML = "Invalid phone number";
            resetNextButton(document.getElementById("next"))
        }
    }
}


function handleSignUp() {
    return event => {
        event.preventDefault()

        document.querySelector("#start span").innerHTML = "PLEASE WAIT..."
        document.querySelector("#start progress").style.display = "block"
        document.getElementById("start").dataset.loading = "1"

        const firstName = document.getElementById("name").value
        const lastName = document.getElementById("lastName").value

        MTProto.Auth.signUp(_formData.phoneNumber, _formData.phoneCodeHash, firstName, lastName).then(async authorization => {
            if (authorization._ === "auth.authorization") {
                console.log("signup success!")
                if (pictureBlob) {
                    console.log(pictureBlob)
                    FileAPI.uploadProfilePhoto("avatar.jpg", pictureBlob).then(l => {
                        AppPermanentStorage.setItem("authorizationData", authorization)
                        AppFramework.Router.push("/")
                    }, error => {
                        console.log(error)
                    });
                } else {
                    AppPermanentStorage.setItem("authorizationData", authorization)
                    AppFramework.Router.push("/")
                }
            } else {
                console.log(authorization)
            }
        }, error => {
            let msg = "Something went terribly wrong"
            if (error.type === "FIRSTNAME_INVALID") {
                msg = "Invalid first name"
                document.getElementById("name").classList.add("invalid");
                document.getElementById("name").nextElementSibling.innerHTML = msg;
            } else if (error.type === "LASTNAME_INVALID") {
                msg = "Invalid last name"
                document.getElementById("lastName").classList.add("invalid");
                document.getElementById("lastName").nextElementSibling.innerHTML = msg;
            }
            console.log(error)
            resetNextButton(document.getElementById("start"), "START MESSAGING")
        })
    }
}

function toggleList() {
    if (hasClass($list, "hidden")) {
        showList()
    } else {
        hideList()
    }
}


function hideList() {
    $list.classList.add("hidden");
    $parent.classList.add("down");
    $parent.classList.remove("up");

    $openDropdown.classList.add("tgico-down");
    $openDropdown.classList.remove("tgico-up");

}

function showList() {
    $list.classList.remove("hidden");
    $parent.classList.remove("down");
    $parent.classList.add("up");


    $openDropdown.classList.remove("tgico-down");
    $openDropdown.classList.add("tgico-up");
}

function fadeBack(elem) {
    elem.classList.remove("fade-in");
    elem.classList.add("hidden");
}


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

function fillDropdown(str) {
    // while ($list.firstChild) {
    //     $list.removeChild($list.firstChild);
    // }
    for (let i = 0; i < $list.childNodes.length; i++) {
        let elem = $list.childNodes[i]
        let name = elem.dataset.name
        if (!str || str.length === 0 || countryTest(str, name)) {
            elem.style.display = "flex"
        } else {
            elem.style.display = "none"
        }
    }

    Array.from(document.getElementsByClassName("dropdown-item")).forEach(function (element) {
        element.addEventListener("click", function (event) {
            event.preventDefault();
            $countryInput.value = event.currentTarget.dataset.name;
            $phoneInput.value = event.currentTarget.dataset.code;
            $phoneInput.dataset.code = event.currentTarget.dataset.code;
            setTimeout(hideList, 1); //idk, it doesn't work without it
        });
    });
}

function countryTest(input, country) {
    if (country.toLowerCase().includes(input.toLowerCase())) return true;
    let split = country.split(/\b(?=[a-z])/ig);
    if (split.length > 1) {
        let abbr = split.map(token => token[0]).join("").toLowerCase();
        if (abbr.includes(input.toLowerCase())) return true;
    }
}

function formatPhoneNumber() {
    let code = $phoneInput.dataset.code;
    if (!code) { //Autofill... Make user select country again
        $phoneInput.value = "";
        $countryInput.value = "";
        fillDropdown();
        return;
    }
    let value = $phoneInput.value.substring(code.length).replace(/\s/g, '');

    let newValue = "";
    let second = true;
    for (let d = value.length - 1; d > -1; d--) {
        if (second) {
            newValue = " " + newValue;
        }
        newValue = value[d] + newValue;
        second = !second;
    }
    newValue = code + " " + newValue;
    $phoneInput.value = newValue.trim();

    if ($phoneInput.value.length > code.length) { //we have number
        document.getElementById("next").disabled = false
    } else {
        document.getElementById("next").disabled = true
    }

    if ($phoneInput.classList.contains("invalid")) {
        $phoneInput.classList.remove("invalid");
        $phoneInput.nextElementSibling.innerHTML = "Phone Number";
    }
}


function initDropdown() {

    setInputFilter($countryInput, function (value) {
        return /^[a-z]*$/i.test(value);
    });

    fillDropdown($countryInput.value);
    $countryInput.addEventListener("focus", showList);
    $countryInput.addEventListener("input", showList);
    $openDropdown.onclick = l => {
        toggleList()
    }
    //countryInput.addEventListener("blur", hideList); //conflict with arrow click
    // $countryInput.parentElement.getElementsByClassName("arrow")[0].addEventListener("click", toggleList);

    const k = ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"]
    k.forEach(function (event) {
        $countryInput.addEventListener(event, function () {
            fillDropdown($countryInput.value);
        });
    });

}

let prevValue = ""

function initCodeInput() {
    $codeInput.addEventListener("focus", Monkey.smoothTrack.bind(Monkey));
    $codeInput.addEventListener("input", Monkey.checkTrack.bind(Monkey)); //input calls blur when window changes, but not focus
    $codeInput.addEventListener("blur", Monkey.smoothIdle.bind(Monkey));

    ["input"].forEach(function (event) {
        $codeInput.addEventListener(event, function () {
            let value = $codeInput.value;
            if (value.length > 5) { //limit length
                $codeInput.value = value.substring(0, 5);
                value = $codeInput.value;
            }
            if (value.length === 5 && value !== prevValue) {
                prevValue = value
                handleSignIn(value)
            } else if ($codeInput.classList.contains("invalid")) {
                $codeInput.classList.remove("invalid");
                $codeInput.nextElementSibling.innerHTML = "Code";
            }
        });
    });
}


function askForFile(accept, callback) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;

    input.onchange = e => {
        var file = e.target.files[0];

        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            callback(content);
        }

    }
    input.click();
}


function initCropper(image) {
    cropper = new Croppie(cropperEl, {
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

    document.getElementById("photoDone").addEventListener("click", function () {
        cropper.result({
            type: 'base64'
        }).then(function (base) {
            const bytes = Uint8Array.from(atob(base.split(",")[1]), c => c.charCodeAt(0))
            console.log(bytes, base)
            pictureBlob = bytes;
            let blob = new Blob([bytes], {type: "image/png"});
            console.log(blob)
            var url = URL.createObjectURL(blob);
            var picture = document.getElementById("picture");
            picture.style.backgroundImage = 'url("' + url + '")';
            picture.querySelector(".tint").classList.remove("hidden");

            hideModal();
        });
    });
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

function load() {
    $countryInput = document.getElementById("country")
    $list = document.getElementById("countryList")
    $openDropdown = document.getElementById("openDropdown")
    $parent = $countryInput.parentElement
    $phoneInput = document.getElementById("phone")
    $codeInput = document.getElementById("code")
    $passwordInput = document.getElementById("password")
    $peekBtn = document.getElementById("peekButton")
    $passwordNext = document.getElementById("passwordNext")
    $passwordNext.style.display = "flex"
    cropperEl = document.getElementById("cropper")

    document.getElementById("start").addEventListener("click", handleSignUp())


    document.addEventListener("click", e => {
        hideList()
    })
    $openDropdown.addEventListener("click", e => {
        e.stopPropagation()
    })
    $countryInput.addEventListener("click", e => {
        e.stopPropagation()
    })


    document.getElementById("editPhone").addEventListener("click", e => {
        fadeOut(document.getElementById("codePane"));
        fadeIn(document.getElementById("phonePane"));
        $codeInput.value = ""
    })


    setInputFilter($phoneInput, function (value) {
        return /^\+[\d ]*$/.test(value)
    })

    Monkey = new MonkeyController(document.getElementById("monkey"))
    Monkey.reset()
    Monkey.stop()

    setInputFilter($codeInput, value => {
        return /^\d*$/.test(value)
    })

    initDropdown()
    initPhoneInput()
    initCodeInput()
    initCropper()
    initModals()

    document.getElementById("picture").addEventListener("click", function () {
        askForFile("image/*", function (file) {
            cropper.bind({
                url: file
            });
            console.log(cropper)
            showModal(document.getElementById("cropperModal"));
        });
    });

    $passwordNext.addEventListener("click", handlePasswordSend())

    document.getElementById("next").onclick = handlePhoneSend()
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
            </div>
        )
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
                handlePhoneSend()
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
                this.props.signUp()
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

            <InputComponent label={"Hint: " + (this.state.response ? this.state.response.hint : "")} type="password" hide ref="passwordInput" peekChange={this.onPeekChange}/>


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
                                password={this.onPassword} monkeyLook={this.state.monkey.monkeyLook.bind(this.state.monkey)}/>
            <PasswordInputComponent ref="password" finished={this.props.finished} monkeyClose={this.state.monkey.close.bind(this.state.monkey)} monkeyPeek={this.monkeyPeek}/>
        </div>
    }

    monkeyPeek(e) {
        if(e) {
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

    h() {
        let classList = ["fading-block"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        } else {
            classList.push("hidden");
        }

        return <div id="registerPane" className={classList.join(" ")}>
            <div id="picture" className="object picture">
                <div className="tint hidden"/>
                <i className="add-icon tgico tgico-cameraadd"/></div>
            <InfoComponent header="Your name" description="Enter your name and add a profile picture"/>

            <div className="input-field">
                <input type="text" id="name" placeholder="Name" autoComplete="off"/>
                <label htmlFor="name" required>Name</label>
            </div>
            <div className="input-field">
                <input type="text" id="lastName" placeholder="Last Name (Optional)" autoComplete="off"/>
                <label htmlFor="lastName" required>Last Name (Optional)</label>
            </div>
            <div id="start" className="btn rp"><span className="button-text">START MESSAGING</span>
                <progress className="progress-circular white"/>
            </div>
        </div>
    }
}


class Login extends Component {
    constructor(props) {
        super(props);

    }

    h() {
        return (
            <div id="login">
                <PhoneInputComponent finished={this.handleSendCode} ref="phonePane"/>
                <CodeAndPasswordPaneComponent ref="codeAndPassword" cancelCode={this.cancelCode}
                                              password={this.password} finished={this.loginSuccess}/>
                <RegisterPaneComponent ref="register"/>
            </div>
        )
    }

    loginSuccess(response) {
        AppPermanentStorage.setItem("authorizationData", response)
        AppFramework.Router.push("/")
        console.log("login success!")
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
            <Login/>
            <div id="cropperModal" className="modal hidden">
                <div className="dialog">
                    <div className="content">
                        <div className="header">
                            <i className="btn-icon rp rps tgico tgico-close close-button"/>
                            <div className="title">Drag to Reposition</div>
                        </div>
                        <div className="body">
                            <div id="cropper">
                            </div>
                            <div id="photoDone" className="done-button rp"><i className="tgico tgico-check"/></div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="position: absolute; bottom: 0; right: 0;">
                <button onClick={l => {
                    AppPermanentStorage.clear() + window.location.reload()
                }}>clear auth
                </button>
            </div>
        </div>
    )
}