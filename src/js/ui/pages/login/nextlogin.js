import VDOM from "../../framework/vdom"
import {MonkeyController} from "./monkey"
import {countries, hasClass} from "../../utils"
import {MTProto} from "../../../mtproto"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"

let $countryInput = null
let $list = null
let $parent = null
let $phoneInput = null
let $codeInput = null
let $passwordInput = null
let $peekBtn = null
let $passwordNext = null

let Monkey = null

let _formData = {}

function isNumberValid(number) {
    return number.length > 9
}

function isCodeValid(code) {
    return /^\d{5}$/.test(code)
}

function handlePhoneSend() {
    return event => {
        event.preventDefault()

        const phoneNumber = $phoneInput.value
        document.querySelector("#next progress").style.display = "block"
        document.querySelector("#next span").innerHTML = "PLEASE WAIT..."

        if (isNumberValid(phoneNumber)) {

            MTProto.Auth.sendCode(phoneNumber).then(sentCode => {
                fadeOut(document.getElementById("phonePane"));
                fadeIn(document.getElementById("codePane"));

                let phone = document.getElementById("phonePreview");
                if (phone.firstChild.tagName.toLowerCase() === "span") {
                    phone.removeChild(phone.firstChild);
                }
                let text = document.createElement("span");
                text.textContent = $phoneInput.value;
                phone.prepend(text);
                /*this.formData.phoneNumber = phoneNumber
                this.formData.sentCode = sentCode
                this.form = "code"
                this.render()*/
            })
        }
    }
}

function handleSignIn(event) {
    if (!/[0-9]*/.test(event.target.value)) {
        event.preventDefault()
        return
    }

    if (!isCodeValid(event.target.value)) return;

    const phoneCode = document.getElementById("code").value
    const phoneCodeHash = _formData.sentCode.phone_code_hash

    _formData.phoneCode = phoneCode
    _formData.phoneCodeHash = phoneCodeHash

    MTProto.Auth.signIn(_formData.formData.phoneNumber, phoneCodeHash, phoneCode).then(authorization => {
        if (authorization._ === "auth.authorizationSignUpRequired") {
            // show sign up
        } else {
            AppPermanentStorage.setItem("authorizationData", authorization)
            AppFramework.Router.push("/")
        }
    })
}

function handleSignUp(event) {
    event.preventDefault()

    const firstName = document.getElementById("signUpFirstName").value
    const lastName = document.getElementById("signUpLastName").value

    MTProto.Auth.signUp(_formData.phoneNumber, _formData.phoneCodeHash, firstName, lastName).then(authorization => {
        if (authorization._ === "auth.authorization") {
            console.log("signup success!")
            AppPermanentStorage.setItem("authorizationData", authorization)
            AppFramework.Router.push("/")
        } else {
            console.log(authorization)
        }
    })
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
}

function showList() {
    $list.classList.remove("hidden");
    $parent.classList.remove("down");
    $parent.classList.add("up");
}

function fadeBack(elem) {
    elem.classList.remove("fade-in");
    elem.classList.add("hidden");
}

function fadeOut(elem) {
    elem.classList.remove("fade-in");
    elem.classList.add("fade-out");
}

function fadeIn(elem) {
    elem.classList.remove("hidden");
    elem.classList.add("fade-in");
}

function fillDropdown(str) {
    while ($list.firstChild) {
        $list.removeChild($list.firstChild);
    }
    for (let n in countries) {
        let elem = document.createElement("div");
        elem.classList.add("dropdown-item");
        let country = countries[n];

        elem.dataset.code = country[0];
        elem.dataset.name = country[1];
        elem.dataset.flag = country[2].toLowerCase();

        let name = elem.dataset.name;

        if (str && str.length > 0 && name.toLowerCase().startsWith(str.toLowerCase())) {
            name = '<span class="highlight">' + name.substring(0, str.length) + '</span>' + name.substring(str.length);
        }
        elem.innerHTML = "<div class=\"country-flag\"><img src=\"/static/images/flags/" + country[2].toLowerCase() + ".svg\"></div>\
                        <div class=\"country-name\">" + name + "</div>\
                        <div class=\"country-code\">" + country[0] + "</div>"

        if (!str || name !== elem.dataset.name) {
            $list.appendChild(elem);
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
        document.getElementById("next").style.display = "flex";
    } else {
        document.getElementById("next").style.display = "none";
    }
}

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.oldValue = "";
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    });
}

function initPhoneInput() {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        $phoneInput.addEventListener(event, function () {
            formatPhoneNumber();
        });
    });
}


function initDropdown() {
    fillDropdown($countryInput.value);
    $countryInput.addEventListener("focus", showList);
    $countryInput.addEventListener("input", showList);
    //countryInput.addEventListener("blur", hideList); //conflict with arrow click
    $countryInput.parentElement.getElementsByClassName("arrow")[0].addEventListener("click", toggleList);

    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        $countryInput.addEventListener(event, function () {
            fillDropdown($countryInput.value);
        });
    });

    setInputFilter($countryInput, function (value) {
        return /^[a-z]*$/i.test(value);
    });
}

function initCodeInput() {
    $codeInput.addEventListener("focus", Monkey.smoothTrack.bind(Monkey));
    $codeInput.addEventListener("input", Monkey.checkTrack.bind(Monkey)); //input calls blur when window changes, but not focus
    $codeInput.addEventListener("blur", Monkey.smoothIdle.bind(Monkey));

    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        $codeInput.addEventListener(event, function () {
            let value = $codeInput.value;
            if (value.length > 5) { //limit length
                $codeInput.value = value.substring(0, 5);
                value = $codeInput.value;
            }
            if (value.length === 5) {
                if ( /*check*/ true) {
                    codeEntered();
                } else {
                    $codeInput.classList.add("invalid");
                    $codeInput.nextElementSibling.innerHTML = "Invalid Code";
                }
            } else if ($codeInput.classList.contains("invalid")) {
                $codeInput.classList.remove("invalid");
                $codeInput.nextElementSibling.innerHTML = "Code";
            }
        });
    });
}


function load() {
    console.log("ll")
    $countryInput = document.getElementById("cc")
    $list = document.getElementById("countryList")
    $parent = $countryInput.parentElement
    $phoneInput = document.getElementById("phone")
    $codeInput = document.getElementById("code")
    $passwordInput = document.getElementById("password")
    $peekBtn = document.getElementById("peekButton")
    $passwordNext = document.getElementById("passwordNext")

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

    document.getElementById("next").onclick = handlePhoneSend()

}

export function LoginPage() {
    return VDOM.render(
        <div id="login">
            <div id="phonePane" className="fading-block" onClick={load}>
                <img className="object" src="/static/images/logo.svg" alt=""/>
                {/*TODO remove onload above*/}
                <div className="info">
                    <div className="header">Sign in to Telegram</div>
                    <div className="description">Please confirm your country and enter your phone number</div>
                </div>
                <div className="dropdown-container" id="countryDropdown">
                    <div className="input-field dropdown down">
                        <input type="text" id="cc" autoComplete="off" placeholder="Cоuntry"/>
                        <label htmlFor="cc" required>Country</label>
                        <i className="arrow btn-icon rp rps tgico"/>
                    </div>
                    <div id="countryList" className="dropdown-list hidden"/>
                </div>
                <div className="input-field">
                    <input type="tel" id="phone" autoComplete="off" placeholder="Phone Number"/>
                    <label htmlFor="phone" required>Phone Number</label>
                </div>
                <div className="checkbox-input">
                    <label><input type="checkbox" name="keep_logger"/><span className="checkmark">
                        <div className="tgico tgico-check"/>
                    </span></label><span className="checkbox-label">Keep me signed in</span>
                </div>
                <div id="next" className="button rp"><span
                    className="button-text">NEXT</span>
                    <progress className="progress-circular white"/>
                </div>
            </div>
            <div id="codePane" className="fading-block hidden">
                <tgs-player id="monkey" className="object"/>
                <div id="subCodePane" className="fading-block">
                    <div className="info">
                        <div id="phonePreview" className="header"><i id="editPhone"
                                                                     className="btn-icon rp rps tgico tgico-edit"/>
                        </div>
                        <div className="description">We have sent you an SMS with the code.</div>
                    </div>
                    <div className="input-field">
                        <input type="text" id="code" placeholder="Code" autoComplete="off"/>
                        <label htmlFor="code" required>Code</label>
                    </div>
                </div>
                <div id="passwordPane" className="fading-block hidden">
                    <div className="info">
                        <div className="header">Enter a Password</div>
                        <div className="description">Your account is protected with an additional password.</div>
                    </div>
                    <div className="input-field password-input peekable">
                        <i id="peekButton" className="btn-icon rp rps tgico"/>
                        <input type="password" id="password" placeholder="Password"/>
                        <label htmlFor="password" required>Password</label>
                    </div>
                    <div id="passwordNext" className="button rp"><span className="button-text">NEXT</span></div>
                </div>
            </div>
            <div id="registerPane" className="fading-block hidden">
                <div id="picture" className="object picture">
                    <div className="tint hidden"/>
                    <i className="add-icon tgico tgico-cameraadd"/></div>
                <div className="info">
                    <div className="header">Your name</div>
                    <div className="description">Enter your name and add a profile picture</div>
                </div>
                <div className="input-field">
                    <input type="text" id="name" placeholder="Name" autoComplete="off"/>
                    <label htmlFor="name" required>Name</label>
                </div>
                <div className="input-field">
                    <input type="text" id="lastName" placeholder="Last Name (Optional)" autoComplete="off"/>
                    <label htmlFor="lastName" required>Last Name (Optional)</label>
                </div>
                <div id="start" className="button rp"><span className="button-text">START MESSAGING</span></div>
            </div>
        </div>
    )
}
