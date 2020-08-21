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
import {VInputPassword} from "../../Elements/Input/VInput"
import VComponent from "../../../V/VRDOM/component/VComponent"
import API from "../../../Api/Telegram/API"
import VButton from "../../Elements/Button/VButton"
import MTProto from "../../../MTProto/External"

class LoginPasswordComponent extends StatefulComponent {
    globalState = {
        login: loginState,
    };

    state = {
        password: "",
        isLoading: false,
        passwordError: null,
    }

    monkeyRef = VComponent.createRef();

    render(props, {password, isLoading, passwordError}, {login}) {
        return (
            <div className="panel">
                <div id="monkey" css-width="150px" css-height="150px" ref={this.monkeyRef} className="object"/>

                <div className="login-page-header">
                    <span className="login-page-header-title">
                        Enter a Password
                    </span>
                    <span className="login-page-header-subtitle">
                        Your account is protected with an additional password.
                    </span>
                </div>

                <form onSubmit={login.accountPassword && this.onSubmitPassword} className="login-page-inputs">
                    <VInputPassword label={login.accountPassword?.hint || "Password"}
                                    value={password}
                                    onInput={this.onInputPassword}
                                    onShownUpdate={this.onShownUpdate}
                                    error={passwordError}
                                    disabled={!login.accountPassword || isLoading}/>

                    <VButton isBlock
                             isLoading={isLoading}
                             type="submit"
                             disabled={!login.accountPassword || isLoading}>
                        {isLoading ? "Please wait..." : "Next"}
                    </VButton>
                </form>
            </div>
        )
    }

    componentDidMount() {
        loginState.monkey.init(this.monkeyRef.$el);
        loginState.monkey.close();

        API.account.getPassword().then(Password => {
            this.setGlobalState({
                login: {
                    accountPassword: Password,
                },
            });
        });
    }

    onShownUpdate = isShown => {
        if (isShown) {
            loginState.monkey.peek();
        } else {
            loginState.monkey.close();
        }
    }

    onInputPassword = (event: InputEvent) => {
        const password = event.target.value.trim();

        this.setState({
            password,
            passwordError: null,
        });
    }

    onSubmitPassword = (event: MouseEvent) => {
        event.preventDefault();

        const {current_algo, srp_id, srp_B} = loginState.accountPassword;
        const {salt1, salt2, g, p} = current_algo;

        this.setState({
            isLoading: true,
        });

        const password = this.state.password
        MTProto.performWorkerTask("mt_srp_check_password", {
            g,
            p,
            salt1,
            salt2,
            srp_id,
            srp_B,
            password: password,
        }).then(srp_ret => {
            console.log("srp_ret", srp_ret)
            API.auth.checkPassword({
                _: "inputCheckPasswordSRP",
                srp_id: srp_ret.srp_id,
                A: srp_ret.A,
                M1: srp_ret.M1
            }).then(Authorization => {
                loginState.authorization = Authorization;
                loginState.authorized();
            }).catch(error => {
                console.log(error)
                let errorText = error.type;

                switch (error.type) {
                    case "PASSWORD_HASH_INVALID":
                        errorText = "Wrong password";

                        this.setGlobalState({
                            login: {
                                accountPassword: null,
                            },
                        });

                        API.account.getPassword().then(Password => {
                            this.setGlobalState({
                                login: {
                                    accountPassword: Password,
                                },
                            });
                        });

                        break;
                    case "SRP_ID_INVALID":
                        errorText = "Invalid SRP ID provided";
                        break;
                    case "SRP_PASSWORD_CHANGED":
                        errorText = "Password has changed";
                        break;
                }

                this.setState({
                    passwordError: errorText,
                    isLoading: false,
                });
            });
        });
    }
}

export default LoginPasswordComponent;