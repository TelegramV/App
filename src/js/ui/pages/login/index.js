import {MTProto} from "../../../mtproto"

import {FrameworkComponent} from "../../framework/component"
import {AppPermanentStorage} from "../../../common/storage"
import {AppFramework} from "../../framework/framework"
import {countries, hasClass} from "../../utils";
import {playSound} from "../../audio";
import {MonkeyController} from "./monkey";
import {TGSPlayer} from "../../vendor/tgs_player"

export class LoginPage extends FrameworkComponent {
    constructor(props = {}) {
        super()
        this.formData = {}
        this.form = "phone"
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

            const phoneNumber = this.phoneInput.value
            document.querySelector("#next progress").style.display = "block"
            document.querySelector("#next span").innerHTML = "PLEASE WAIT..."

            if (this.isNumberValid(phoneNumber)) {

                MTProto.Auth.sendCode(phoneNumber).then(sentCode => {
                    this.fadeOut(document.getElementById("phonePane"));
                    this.fadeIn(document.getElementById("codePane"));

                    let phone = document.getElementById("phonePreview");
                    if(phone.firstChild.tagName.toLowerCase() === "span") {
                        phone.removeChild(phone.firstChild);
                    }
                    let text = document.createElement("span");
                    text.textContent = this.phoneInput.value;
                    phone.prepend(text);
                    /*this.formData.phoneNumber = phoneNumber
                    this.formData.sentCode = sentCode
                    this.form = "code"
                    this.render()*/
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
                    this.form = "singup"
                    this.render()
                } else {
                    AppPermanentStorage.setItem("authorizationData", authorization)
                    AppFramework.Router.push("/")
                }
            })
        }
    }

    handleSignUp(event) {
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

    hideList() {
        this.list.classList.add("hidden");
        this.parent.classList.add("down");
        this.parent.classList.remove("up");
    }

    showList() {
        this.list.classList.remove("hidden");
        this.parent.classList.remove("down");
        this.parent.classList.add("up");
    }

    toggleList() {
        if (hasClass(this.list, "hidden")) {
            this.showList();
        } else {
            this.hideList();
        }
    }

    fadeBack(elem) {
        elem.classList.remove("fade-in");
        elem.classList.add("hidden");
    }

    fadeOut(elem) {
        elem.classList.remove("fade-in");
        elem.classList.add("fade-out");
    }

    fadeIn(elem) {
        elem.classList.remove("hidden");
        elem.classList.add("fade-in");
    }

    fillDropdown(str) {
        while (this.list.firstChild) {
            this.list.removeChild(this.list.firstChild);
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
                this.list.appendChild(elem);
            }
        }

        const self = this

        Array.from(document.getElementsByClassName("dropdown-item")).forEach(function(element) {
            element.addEventListener("click", function(event) {
                event.preventDefault();
                self.countryInput.value = event.currentTarget.dataset.name;
                self.phoneInput.value = event.currentTarget.dataset.code;
                self.phoneInput.dataset.code = event.currentTarget.dataset.code;
                setTimeout(self.hideList.bind(self), 1); //idk, it doesn't work without it
            });
        });
    }

    formatPhoneNumber() {
        let code = this.phoneInput.dataset.code;
        if(!code) { //Autofill... Make user select country again
            this.phoneInput.value = "";
            this.countryInput.value = "";
            this.fillDropdown();
            return;
        }
        let value = this.phoneInput.value.substring(code.length).replace(/\s/g, '');

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
        this.phoneInput.value = newValue.trim();

        if (this.phoneInput.value.length > code.length) { //we have number
            document.getElementById("next").style.display = "flex";
        } else {
            document.getElementById("next").style.display = "none";
        }
    }

    setInputFilter(textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
            textbox.oldValue = "";
            textbox.addEventListener(event, function() {
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

    initPhoneInput() {
        const self = this;
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
            console.log(self)
            self.phoneInput.addEventListener(event, function() {
                self.formatPhoneNumber();
            });
        });
    }

    initDropdown() {
        const self = this
        this.fillDropdown(this.countryInput.value);
        this.countryInput.addEventListener("focus", this.showList.bind(self));
        this.countryInput.addEventListener("input", this.showList.bind(self));
        //countryInput.addEventListener("blur", hideList); //conflict with arrow click
        this.countryInput.parentElement.getElementsByClassName("arrow")[0].addEventListener("click", this.toggleList.bind(self));

        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
            self.countryInput.addEventListener(event, function() {
                self.fillDropdown(self.countryInput.value);
            });
        });

        this.setInputFilter(this.countryInput, function(value) {
            return /^[a-z]*$/i.test(value);
        });
    }
    initCodeInput() {
        const self = this
        this.codeInput.addEventListener("focus", this.monkey.smoothTrack.bind(this.monkey));
        this.codeInput.addEventListener("input", this.monkey.checkTrack.bind(this.monkey)); //input calls blur when window changes, but not focus
        this.codeInput.addEventListener("blur", this.monkey.smoothIdle.bind(this.monkey));

        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
            self.codeInput.addEventListener(event, function() {
                let value = self.codeInput.value;
                if (value.length > 5) { //limit length
                    self.codeInput.value = value.substring(0, 5);
                    value = self.codeInput.value;
                }
                if (value.length === 5) {
                    if ( /*check*/ true) {
                        self.codeEntered();
                    } else {
                        self.codeInput.classList.add("invalid");
                        self.codeInput.nextElementSibling.innerHTML = "Invalid Code";
                    }
                } else if (self.codeInput.classList.contains("invalid")) {
                    self.codeInput.classList.remove("invalid");
                    self.codeInput.nextElementSibling.innerHTML = "Code";
                }
            });
        });
    }

    load() {
        this.countryInput = document.getElementById("cc")
        this.list = document.getElementById("countryList");
        this.parent = this.countryInput.parentElement;
        this.phoneInput = document.getElementById("phone");
        this.codeInput = document.getElementById("code");
        this.passwordInput = document.getElementById("password");
        this.peekBtn = document.getElementById("peekButton");
        this.passwordNext = document.getElementById("passwordNext");
        this.setInputFilter(this.phoneInput, function(value) {
            return /^\+[\d ]*$/.test(value);
        });

        this.monkey = new MonkeyController(document.getElementById("monkey"));
        this.monkey.reset();
        this.monkey.stop();

        this.setInputFilter(this.codeInput, function(value) {
            return /^\d*$/.test(value);
        });

        this.initDropdown();
        this.initPhoneInput();
        this.initCodeInput();

        document.getElementById("next").onclick = this.handlePhoneSend()

    }

    h() {
        return (
            <div id="login">
                <div id="phonePane" className="fading-block">
                    <img className="object" src="/static/images/logo.svg" alt="" onLoad={this.load.bind(this)}/>
                    {/*TODO remove onload above*/}
                    <div className="info">
                        <div className="header">Sign in to Telegram</div>
                        <div className="description">Please confirm your country and enter your phone number</div>
                    </div>
                    <div className="dropdown-container" id="countryDropdown">
                        <div className="input-field dropdown down">
                            <input type="text" id="cc" autoComplete="off" placeholder="Cоuntry"/>
                            <label for="cc" required>Country</label>
                            <i className="arrow btn-icon rp rps tgico"/>
                        </div>
                        <div id="countryList" className="dropdown-list hidden"/>
                    </div>
                    <div className="input-field">
                        <input type="tel" id="phone" autoComplete="off" placeholder="Phone Number"/>
                        <label for="phone" required>Phone Number</label>
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
}
