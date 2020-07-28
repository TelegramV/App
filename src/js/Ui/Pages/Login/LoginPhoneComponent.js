/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import loginState from "./LoginState"
import logo from "../../../../../public/static/images/loginlogo.svg"
import {VInputDropdown, VInputValidate} from "../../Elements/Input/VInput"
import VCheckbox from "../../Elements/Input/VCheckbox"
import VButton from "../../Elements/Button/VButton"
import VComponent from "../../../V/VRDOM/component/VComponent"
import API from "../../../Api/Telegram/API"

const CountryDropdownItemFragment = ({flag, name, code, onMouseDown}) => {
    return <div className="dropdown-item rp" onMouseDown={onMouseDown}>
        <div className="country-flag">{flag}</div>
        <div className="country-name">{name}</div>
        <div className="country-code">{code}</div>
    </div>
}

class LoginPhoneComponent extends StatefulComponent {
    globalState = {
        login: loginState,
    };

    state = {
        login: loginState,
        isLoading: false,
        phoneError: null,
    }

    countryDropdownRef: { component: VInputDropdown } = VComponent.createComponentRef();
    phoneRef = VComponent.createFragmentRef();

    countryTemplate = country => {
        return <CountryDropdownItemFragment {...country} onMouseDown={() => this.onCountryClick(country)}/>
    }

    render(props, {isLoading, phoneError}, {login}) {
        const {countries, phone, keepMeSignedIn, country} = login;

        const isValid = this.isPhoneValid(phone);
        const canSubmit = !isLoading && isValid;

        return (
            <div className="panel phone-panel">
                <div className="login-page-logo">
                    <img src={logo} alt="Telegram"/>
                </div>

                <div className="login-page-header">
                    <span className="login-page-header-title">Sign in to Telegram</span>
                    <span className="login-page-header-subtitle">
                        Please confirm your country and enter your phone number.
                    </span>
                </div>

                <VButton isUppercase={false} onClick={event => {
                    event.preventDefault();
                    loginState.setQRView();
                }} isFlat>Or try login using QR-code</VButton>

                {false /*remove to enable*/ && <VButton isUppercase={false} onClick={event => {
                    event.preventDefault();
                    loginState.setBotView();
                }} isFlat>Beep-boop, I am bot</VButton> }

                <form onSubmit={canSubmit && this.onSendPhoneClick} className="login-page-inputs">
                    <VInputDropdown label="Country"
                                    items={countries}
                                    filter={this.countryFilter}
                                    template={this.countryTemplate}
                                    currentValue={country?.name}
                                    ref={this.countryDropdownRef}/>

                    <VInputValidate label="Phone number"
                                    type="tel"
                                    onInput={this.onPhoneInput}
                                    value={phone}
                                    error={phoneError}
                                    maxLength={24}
                                    filter={this.filterPhone}
                                    ref={this.phoneRef}/>

                    <VCheckbox label="Keep me signed in"
                               checked={keepMeSignedIn}
                               onClick={() => this.setGlobalState({login: {keepMeSignedIn: !keepMeSignedIn}})}/>

                    <VButton isBlock
                             isLoading={isLoading}
                             type="submit"
                             css-opacity={!isValid && "0"}
                             disabled={!canSubmit}>
                        {isLoading ? "Please wait..." : "Next"}
                    </VButton>
                </form>
            </div>
        )
    }

    onSendPhoneClick = (event: Event) => {
        event.preventDefault();

        this.setState({
            isLoading: !this.state.isLoading
        });

        const phone = loginState.phone;

        const processSentCode = SentCode => {
            SentCode.__time = (new Date).getTime();
            SentCode.__phone = phone;

            this.setGlobalState({
                login: {
                    stage: "code",
                    sentCode: SentCode,
                }
            });

            localStorage.setItem("auth.sentCode", JSON.stringify(SentCode));

            return SentCode;
        };

        return API.auth.sendCode(phone).then(processSentCode).catch(error => {
            if (error.type.startsWith("PHONE_MIGRATE")) {
                const dcId = parseInt(error.type.slice("PHONE_MIGRATE_".length));

                return API.auth.sendCode(phone, dcId)
                    .then(processSentCode);
            }

            if (error.type.startsWith("NETWORK_MIGRATE")) {
                const dcId = parseInt(error.type.slice("NETWORK_MIGRATE_".length));

                return API.auth.sendCode(phone, dcId)
                    .then(processSentCode);
            }

            throw error;
        }).catch(error => {
            let errorText = error.type;

            switch (error.type) {
                case "PHONE_NUMBER_BANNED":
                    errorText = "The provided phone number is banned from telegram";
                    break;
                case "PHONE_NUMBER_FLOOD":
                    errorText = "You asked for the code too many times.";
                    break;
                case "PHONE_NUMBER_INVALID":
                    errorText = "Invalid phone number";
                    break;
                case "PHONE_PASSWORD_FLOOD":
                    errorText = "You have tried logging in too many times";
                    break;
                case "PHONE_PASSWORD_PROTECTED":
                    errorText = "This phone is password protected";
                    break;
                case "SMS_CODE_CREATE_FAILED":
                    errorText = "An error occurred while creating the SMS code";
                    break;
            }

            this.setState({
                phoneError: errorText,
            });
        }).finally(() => {
            this.setState({
                isLoading: false,
            });
        })
    }

    onPhoneInput = (event: InputEvent) => {
        let phone = event.target.value.trim().replace(/(\d{3})(\d{3})/, "$1 $2");

        if (!phone.startsWith("+")) {
            phone = "+" + phone;
        }

        if (phone.length > 1) {
            for (const country of loginState.countries.items) {
                if (phone.replace(" ", "").startsWith(country.code.replace(" ", ""))) {
                    this.countryDropdownRef.component.setCurrent(country);
                    break;
                }
            }
        }

        this.setState({
            phoneError: null,
        });

        this.setGlobalState({
            login: {
                phone,
            }
        });
    }

    countryFilter = (input, country) => {
        country = country.name;

        if (country.toLowerCase().includes(input.toLowerCase())) {
            return true;
        }

        const split = country.split(/\b(?=[a-z])/ig);

        if (split.length > 1) {
            const abbr = split.map(token => token[0]).join("").toLowerCase();

            if (abbr.includes(input.toLowerCase())) {
                return true;
            }
        }
    }

    onCountryClick = country => {
        this.countryDropdownRef.component.setCurrent(country);
        this.setGlobalState({
            login: {
                phone: country.code,
                country,
            }
        });
    }

    isPhoneValid = phone => {
        return phone && phone.length > 6;
    }

    filterPhone = code => {
        return /^[0-9 +]{0,20}$/.test(code);
    }
}

export default LoginPhoneComponent;