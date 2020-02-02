import PaneComponent from "./common/PaneComponent"
import {DropdownComponent} from "./common/dropdownComponent";
import {InputComponent} from "../../main/components/input/inputComponent";
import CheckboxComponent from "../../main/components/input/checkboxComponent";
import {ButtonWithProgressBarComponent} from "../../main/components/input/buttonComponent";
import InfoComponent from "./common/infoComponent"
import CountryDropdownItemComponent from "./common/countryDropdownItemComponent"

import {MTProto} from "../../../../mtproto/external"
import {countries} from "../../../utils"
import {defaultDcID} from "../../../../application";

export default class PhoneInputComponent extends PaneComponent {
    constructor(props) {
        super(props)

        this.state = {
            country: null,
            isLoading: false,
            nextDisabled: true,
            keepLogged: true
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
                <img className="object" src="./static/images/loginlogo.svg" alt=""
                     onClick={this.props.finished}/>
                <InfoComponent header="Sign in to Telegram"
                               description="Please confirm your country and enter your phone number"/>
                <DropdownComponent label="Country" data={this.generateFullDropdown()}
                                   template={CountryDropdownItemComponent} selected={this.onDropdownSelect}
                                   ref="dropdown"/>
                <InputComponent label="Phone Number" type="tel"
                                filter={value => /^\+?[\d ]*$/.test(value)} input={this.phoneInput} ref="phone"/>
                <CheckboxComponent label="Keep me signed in" checked input={this.checkboxInput}/>
                <ButtonWithProgressBarComponent label="Next" disabled={this.state.nextDisabled}
                                                click={this.handlePhoneSend} ref="next"/>
                <div className="qr-login-button" onClick={this.qrLogin}>Quick log in using QR code<progress className="progress-circular"/></div>
            </div>
        )
    }

    qrLogin(ev) {
        this.props.qrLoginInit()
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

    generateFullDropdown() {
        return countries.map(l => {
            return {
                flag: l[3],
                name: l[1],
                code: l[0]
            }
        })
    }

    onDropdownSelect(value) {
        const phone = this.refs.get("phone")
        phone.setValue(value.code)
    }

    checkboxInput(ev) {
        this.state.keepLogged = ev.currentTarget.querySelector("input[type=checkbox]").checked;
    }
}