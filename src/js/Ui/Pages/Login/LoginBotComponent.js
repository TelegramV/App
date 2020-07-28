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
import VInput from "../../Elements/Input/VInput"
import VComponent from "../../../V/VRDOM/component/VComponent"
import API from "../../../Api/Telegram/API"
import VButton from "../../Elements/Button/VButton"

class LoginBotComponent extends StatefulComponent {
    globalState = {
        login: loginState,
    };

    state = {
        token: ""
    };

    render(props, {isLoading}, {login}) {
        return (
            <div className="panel fading-block fade-in">
                <div className="login-page-header">
                    <span className="login-page-header-subtitle" style="text-align: left;">
                        Enter bot token
                    </span>
                    <VInput label="Token" 
                        value={this.state.token}
                        maxLength={60}
                        onInput={(ev) => {
                        this.setState({
                            token: ev.currentTarget.value
                        })
                    }}/>
                    <VButton isBlock
                             type="submit"
                             disabled={this.state.token.length < 30}
                             onClick={this.loginAsBot}>
                        Next
                    </VButton>
                </div>

                <div id="qr-container" ref={this.containerRef}>{isLoading && <VSpinner/>}</div>
            </div>
        )
    }

    loginAsBot = () => {
        API.auth.importBotAuthorization(this.state.token).then(Authorization => {
            console.log(Authorization);
            loginState.authorized(Authorization);
        })
    }
}

export default LoginBotComponent;