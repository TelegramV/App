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
import LoginPhoneComponent from "./LoginPhoneComponent"
import LoginCodeComponent from "./LoginCodeComponent"
import LoginPasswordComponent from "./LoginPasswordComponent"
import LoginRegisterComponent from "./LoginRegisterComponent"
import LoginQRComponent from "./LoginQRComponent"
import LoginBotComponent from "./LoginBotComponent"

class LoginPageComponent extends StatefulComponent {
    globalState = {
        login: loginState,
    };

    render(props, state, {login}) {
        const {stage} = login;

        return (
            <div className="login-page">
                {stage === "phone" && <LoginPhoneComponent/>}
                {stage === "code" && <LoginCodeComponent/>}
                {stage === "password" && <LoginPasswordComponent/>}
                {stage === "register" && <LoginRegisterComponent/>}
                {stage === "qr" && <LoginQRComponent/>}
                {stage === "bot" && <LoginBotComponent/>}
            </div>
        )
    }

    componentWillUnmount() {
        this.globalState.login.monkey.destroy();
    }
}

export default LoginPageComponent;