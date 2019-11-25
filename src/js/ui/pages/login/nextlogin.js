import VDOM from "../../framework/vdom"
import {MonkeyController} from "./monkey"
import {countries, hasClass} from "../../utils"
import {MTProto} from "../../../mtproto"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"
import {FileAPI} from "../../../api/fileAPI";
import AppCryptoManager from "../../../mtproto/crypto/cryptoManager";

// do not use `import` to get this, because DO NOT DO THIS
require("./../../vendor/tgs_player")

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

function handlePasswordSend() {
    return async event => {
        event.preventDefault()
        if ($passwordNext.disabled || $passwordNext.dataset.loading === "1") return

        const password = $passwordInput.value
        document.querySelector("#passwordNext span").innerHTML = "PLEASE WAIT..."
        document.querySelector("#passwordNext progress").style.display = "block"

        document.getElementById("passwordNext").dataset.loading = "1"

        const response = _formData.passwordData
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
            resetNextButton($passwordNext)
            console.log(response);

            AppPermanentStorage.setItem("authorizationData", response)
            AppFramework.Router.push("/")
            //authorizedStart(response)
        }, reject => {
            console.log(reject)
            $phoneInput.classList.add("invalid");

            if (reject.type === "INVALID_PASSWORD_HASH") {
                $phoneInput.nextElementSibling.innerHTML = "Invalid password";
            } else {
                $phoneInput.nextElementSibling.innerHTML = reject.type;
            }
            resetNextButton($passwordNext)
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
    }, reject => {
        if (reject.type === "SESSION_PASSWORD_NEEDED") {
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

function fadeOut(elem) {
    elem.classList.remove("fade-in");
    elem.classList.add("fade-out");
}

function fadeIn(elem) {
    elem.classList.remove("hidden");
    elem.classList.add("fade-in");
}

function successfulAuth() {
    if (!document.getElementById("keepLogger").checked) {

        window.addEventListener("beforeunload", function (e) {
            AppPermanentStorage.clear() // tODO move this to proper place
        }, false);
    }
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
        let flag = emoji.replace_colons(":flag-" + elem.dataset.flag + ":");

        elem.innerHTML = "<div class=\"country-flag\">" + flag + "</div>\
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
        if (str.length === 0 || name.toLowerCase().startsWith(str.toLowerCase())) {
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
        document.getElementById("next").disabled = false
    } else {
        document.getElementById("next").disabled = true
    }

    if ($phoneInput.classList.contains("invalid")) {
        $phoneInput.classList.remove("invalid");
        $phoneInput.nextElementSibling.innerHTML = "Phone Number";
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
    ["input"].forEach(function (event) {
        $phoneInput.addEventListener(event, function () {
            formatPhoneNumber();
        });
    });
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

    generateFullDropdown()

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

export function LoginPage() {
    return VDOM.render(
        <div>
            <div id="login">
                <div id="phonePane" className="fading-block">
                    <img className="object" src="./static/images/logo.svg" alt="" onLoad={load}/>
                    {/*TODO remove onload above*/}
                    <div className="info">
                        <div className="header">Sign in to Telegram</div>
                        <div className="description">Please confirm your country and enter your phone number</div>
                    </div>
                    <div className="dropdown-container" id="countryDropdown">
                        <div className="input-field dropdown down">
                            <input type="text" id="cc" autoComplete="off" placeholder="Cоuntry"/>
                            <label for="cc" required>Country</label>
                            <i className="arrow btn-icon rp rps tgico tgico-down" id="openDropdown"/>
                        </div>
                        <div id="countryList" className="dropdown-list hidden"/>
                    </div>
                    <div className="input-field">
                        <input type="tel" id="phone" autoComplete="off" placeholder="Phone Number"/>
                        <label for="phone" required>Phone Number</label>
                    </div>
                    <div className="checkbox-input">
                        <label><input type="checkbox" name="keep_logger" id="keepLogger"/><span className="checkmark">
                        <div className="tgico tgico-check"/>
                    </span></label><span className="checkbox-label">Keep me signed in</span>
                    </div>
                    <button id="next" className="btn rp" disabled="disabled"><span
                        className="button-text">NEXT</span>
                        <progress className="progress-circular white"/>
                    </button>
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
                            <label for="code" required>Code</label>
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
                            <label for="password" required>Password</label>
                        </div>
                        <div id="passwordNext" className="btn rp"><span
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
                        <label for="name" required>Name</label>
                    </div>
                    <div className="input-field">
                        <input type="text" id="lastName" placeholder="Last Name (Optional)" autoComplete="off"/>
                        <label for="lastName" required>Last Name (Optional)</label>
                    </div>
                    <div id="start" className="btn rp"><span className="button-text">START MESSAGING</span>
                        <progress className="progress-circular white"/>
                    </div>
                </div>
            </div>
            <div id="cropperModal" className="modal hidden">
                <div className="dialog">
                    <div className="content">
                        <div className="header">
                            <i className="btn-icon rp rps tgico tgico-close close-button"></i>
                            <div className="title">Drag to Reposition</div>
                        </div>
                        <div className="body">
                            <div id="cropper">
                            </div>
                            <div id="photoDone" className="done-button rp"><i className="tgico tgico-check"></i></div>
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
