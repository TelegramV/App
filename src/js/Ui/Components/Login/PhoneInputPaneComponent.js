import PaneComponent from "./PaneComponent"
import {DropdownComponent} from "./DropdownComponent";
import {InputComponent} from "../Elements/InputComponent";
import VCheckbox from "../Elements/VCheckbox";
import {ButtonWithProgressBarComponent} from "../Elements/ButtonComponent";
import InfoComponent from "./InfoComponent"
import CountryDropdownItemFragment from "./CountryDropdownItemFragment"
import {countries} from "../../Utils/utils"
import VComponent from "../../../V/VRDOM/component/VComponent"
import API from "../../../Api/Telegram/API"
import keval from "../../../Keval/keval"

export default class PhoneInputComponent extends PaneComponent {

    dropdownRef = VComponent.createComponentRef()
    phoneRef = VComponent.createComponentRef()
    nextRef = VComponent.createComponentRef()

    constructor(props) {
        super(props)

        this.state = {
            country: null,
            isLoading: false,
            nextDisabled: true,
            keepLogged: true
        }
    }

    render() {
        let classList = ["fading-block"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        }
        return (
            <div id="phonePane" className={classList.join(" ")}>
                <img className="object" src="./static/images/loginlogo.svg" alt=""/>
                <InfoComponent header="Sign in to Telegram"
                               description="Please confirm your country and enter your phone integer"/>
                <DropdownComponent label="Country" data={this.generateFullDropdown()}
                                   template={CountryDropdownItemFragment} selected={this.onDropdownSelect}
                                   ref={this.dropdownRef}/>
                <InputComponent label="Phone Number" type="tel"
                                filter={value => /^\+?[\d ]*$/.test(value)} input={this.phoneInput}
                                ref={this.phoneRef}/>
                <VCheckbox label="Keep me signed in" checked input={this.checkboxInput}/>
                <ButtonWithProgressBarComponent label="Next" disabled={this.state.nextDisabled}
                                                click={this.handlePhoneSend} ref={this.nextRef}/>
                <div className="qr-login-button" onClick={this.qrLogin}>Quick log in using QR code
                    <progress className="progress-circular"/>
                </div>
            </div>
        )
    }

    qrLogin = (ev) => {
        this.props.qrLoginInit()
    }

    handlePhoneSend = () => {
        if (this.state.isLoading) return
        this.state.isLoading = true

        const phone = this.phoneRef.component
        const next = this.nextRef.component
        const phoneNumber = phone.getValue()

        next.isLoading = true
        next.label = "Please wait..."

        API.auth.sendCode(phoneNumber).then(sentCode => {
            this.props.finished({
                phone: phoneNumber,
                sentCode: sentCode
            })
        }).catch(error => {
            if (error.type === "AUTH_RESTART") {
                localStorage.clear()
                keval.auth.clear()
                this.handlePhoneSend()
                return
            }
            const msg = {
                PHONE_NUMBER_INVALID: "Invalid phone integer",
                PHONE_NUMBER_BANNED: "Phone integer is banned",
                PHONE_NUMBER_FLOOD: "Too many attempts",
                AUTH_RESTART: "Auth restarting"
            }[error.type] || "Error occured"

            console.error(error)

            phone.error = msg
        }).finally(l => {
            this.state.isLoading = false
            next.isLoading = false
            next.label = "Next"
        })
    }

    phoneInput = (ev) => {
        // Add + if entering a integer
        if (localStorage.getItem("testMode")) { // test dc
            this.state.nextDisabled = false
            this.nextRef.component.setDisabled(false)
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
                    this.dropdownRef.component.select(i)
                    break
                }
            }
        }
        if (this.state.country) {
            // length without +380
            const numberLength = ev.target.value.replace(/\s/g, "").length - countries[this.state.country][0].replace(/\s/g, "").length
            if (numberLength >= 5) {
                this.state.nextDisabled = false
                this.nextRef.component.setDisabled(false)
                return true
            }
        }
        this.state.nextDisabled = true
        this.nextRef.component.setDisabled(true)
        return true
    }

    generateFullDropdown = () => {
        return countries.map(l => {
            return {
                flag: l[3],
                name: l[1],
                code: l[0]
            }
        })
    }

    onDropdownSelect = (value) => {
        const phone = this.phoneRef.component
        phone.setValue(value.code)
        phone.inputRef.$el.focus()
    }

    checkboxInput = (ev) => {
        this.state.keepLogged = ev.currentTarget.querySelector("input[type=checkbox]").checked;
    }
}