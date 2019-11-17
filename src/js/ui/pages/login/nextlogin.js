import VDOM from "../../framework/vdom"
import {MonkeyController} from "./monkey"
import {countries, hasClass} from "../../utils"
import {MTProto} from "../../../mtproto"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"
import {TGSPlayer} from "./../../vendor/tgs_player"
import mt_srp_check_password from "../../../mtproto/crypto/mt_srp/mt_srp";

let $countryInput = null
let $list = null
let $openDropdown = null
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
                _formData.phoneNumber = phoneNumber
                _formData.sentCode = sentCode
            })
        }
    }
}

function handlePasswordSend() {
    return event => {
        event.preventDefault()

        const password = $passwordInput.value
        document.querySelector("#passwordNext progress").style.display = "block"
        document.querySelector("#passwordNext span").innerHTML = "PLEASE WAIT..."

        const response = _formData.passwordData
        const salt1 = response.current_algo.salt1
        const salt2 = response.current_algo.salt2
        const g = response.current_algo.g
        const p = response.current_algo.p
        const srp_id = response.srp_id
        const srp_B = response.srp_B

        const srp_ret = mt_srp_check_password(g, p, salt1, salt2, srp_id, srp_B, password);

        MTProto.invokeMethod("auth.checkPassword", {
            password: {
                _: "inputCheckPasswordSRP",
                srp_id: srp_ret.srp_id,
                A: srp_ret.A,
                M1: srp_ret.M1
            }
        }).then(response => {
            console.log(response);

            AppPermanentStorage.setItem("authorizationData", response)
            AppFramework.Router.push("/")
            //authorizedStart(response)
        }, reject => {
            console.log(reject)
        })
    }
}

function handleSignIn(code) {
    if (!isCodeValid(code)) return;

    const phoneCode = code
    const phoneCodeHash = _formData.sentCode.phone_code_hash

    _formData.phoneCode = phoneCode
    _formData.phoneCodeHash = phoneCodeHash

    MTProto.Auth.signIn(_formData.phoneNumber, phoneCodeHash, phoneCode).then(authorization => {
        if (authorization._ === "auth.authorizationSignUpRequired") {
            // show sign up
            fadeOut(document.getElementById("codePane"));
            fadeIn(document.getElementById("registerPane"));
            return
        } else {
            AppPermanentStorage.setItem("authorizationData", authorization)
            AppFramework.Router.push("/")
            return
        }

        $codeInput.classList.add("invalid");
        $codeInput.nextElementSibling.innerHTML = "Invalid Code";
    }, reject => {
        if(reject.type === "SESSION_PASSWORD_NEEDED") {
            MTProto.invokeMethod("account.getPassword", {}).then(response => {
                /*if (response._ !== "passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow") {
                    throw new Error("Unknown 2FA algo")
                }*/
                //console.log(response)
                //setCode2FAForm()

                fadeOut(document.getElementById("subCodePane"));
                fadeIn(document.getElementById("passwordPane"));
                _formData.passwordData = response
            })
        } else {
            $codeInput.classList.add("invalid");
            $codeInput.nextElementSibling.innerHTML = "Invalid Code";
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

function generateFullDropdown() {
    for (let n in countries) {
        let elem = document.createElement("div");
        elem.classList.add("dropdown-item");
        let country = countries[n];

        elem.dataset.code = country[0];
        elem.dataset.name = country[1];
        elem.dataset.flag = country[2].toLowerCase();

        let name = elem.dataset.name;


        elem.innerHTML = "<div class=\"country-flag\"><img src=\"/static/images/flags/" + country[2].toLowerCase() + ".svg\"></div>\
                        <div class=\"country-name\">" + name + "</div>\
                        <div class=\"country-code\">" + country[0] + "</div>"

        $list.appendChild(elem);
    }
}
function fillDropdown(str) {
    // while ($list.firstChild) {
    //     $list.removeChild($list.firstChild);
    // }
    for (let i = 0; i < $list.childNodes.length; i++) {
        let elem = $list.childNodes[i]
        let name = elem.dataset.name
        if (name.toLowerCase().startsWith(str.toLowerCase()) || str.length === 0) {
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
    console.log($openDropdown)
    $openDropdown.onclick = l => {
        alert("test")
    }
    //countryInput.addEventListener("blur", hideList); //conflict with arrow click
    // $countryInput.parentElement.getElementsByClassName("arrow")[0].addEventListener("click", toggleList);

    const k = ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"]
    k.forEach(function (event) {
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
                handleSignIn(value)
            } else if ($codeInput.classList.contains("invalid")) {
                $codeInput.classList.remove("invalid");
                $codeInput.nextElementSibling.innerHTML = "Code";
            }
        });
    });
}


function load() {
    $countryInput = document.getElementById("cc")
    $list = document.getElementById("countryList")
    $openDropdown = document.getElementById("openDropdown")
    $parent = $countryInput.parentElement
    $phoneInput = document.getElementById("phone")
    $codeInput = document.getElementById("code")
    $passwordInput = document.getElementById("password")
    $peekBtn = document.getElementById("peekButton")
    $passwordNext = document.getElementById("passwordNext")
    $passwordNext.style.display = "flex"

    setInputFilter($phoneInput, function (value) {
        return /^\+[\d ]*$/.test(value)
    })

    Monkey = new MonkeyController(document.getElementById("monkey"))
    Monkey.reset()
    Monkey.stop()

    generateFullDropdown()

    setInputFilter($codeInput, value => {
        return /^\d*$/.test(value)
    })

    initDropdown()
    initPhoneInput()
    initCodeInput()

    $passwordNext.addEventListener("click", handlePasswordSend())

    document.getElementById("next").onclick = handlePhoneSend()

}

export function LoginPage() {
    return VDOM.render(
        <div id="login">
            <div id="phonePane" className="fading-block">
                <img className="object" src="/static/images/logo.svg" alt="" onLoad={load}/>
                {/*TODO remove onload above*/}
                <div className="info">
                    <div className="header">Sign in to Telegram</div>
                    <div className="description">Please confirm your country and enter your phone number</div>
                </div>
                <div className="dropdown-container" id="countryDropdown">
                    <div className="input-field dropdown down">
                        <input type="text" id="cc" autoComplete="off" placeholder="Cоuntry"/>
                        <label htmlFor="cc" required>Country</label>
                        <i className="arrow btn-icon rp rps tgico" id="openDropdown"/>
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
                    <div id="passwordNext" className="button rp"><span
                        className="button-text">NEXT</span>
                        <progress className="progress-circular white"/>
                    </div>
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
