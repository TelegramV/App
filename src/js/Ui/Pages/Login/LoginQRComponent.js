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
import VSpinner from "../../Components/Elements/VSpinner"
import VComponent from "../../../V/VRDOM/component/VComponent"
import API from "../../../Api/Telegram/API"
import MTProto from "../../../MTProto/External"
import VButton from "../../Elements/Button/VButton"

class LoginQRComponent extends StatefulComponent {
    globalState = {
        login: loginState,
    };

    state = {
        isLoading: true,
    };

    containerRef = VComponent.createRef();

    render(props, {isLoading}, {login}) {
        return (
            <div className="panel fading-block fade-in">
                <div className="login-page-header">
                    <VButton isRound
                             isStatic
                             onClick={() => loginState.setPhoneInputView()}>
                        <i class="tgico tgico-back"/>
                    </VButton>

                    <span className="login-page-header-subtitle" style="text-align: left;">
                        <ol>
                            <li>Open Telegram on your phone</li>
                            <li>Go to <b>Settings -> Devices -> Scan QR Code</b></li>
                            <li>Scan this image to Log In</li>
                        </ol>
                    </span>
                </div>

                <div ref={this.containerRef}>{isLoading && <VSpinner/>}</div>
            </div>
        )
    }

    componentDidMount() {
        this.refreshToken();
    }

    componentWillMount(props) {
        MTProto.UpdatesManager.subscribe("updateLoginToken", this.onUpdateLoginToken);
    }

    componentWillUnmount() {
        MTProto.UpdatesManager.unsubscribe("updateLoginToken", this.onUpdateLoginToken);
    }

    onUpdateLoginToken = update => {
        if (update._ === "auth.loginTokenSuccess") {
            loginState.authorized(update.authorization)
            return;
        }

        this.exportLoginToken().then(LoginToken => {
            if (LoginToken._ === "auth.loginTokenSuccess") {
                loginState.authorized(LoginToken.authorization)
            }
        });
    }

    refreshToken = () => {
        console.warn("[QR] refreshing token");

        this.setState({
            isLoading: true,
        });

        this.exportLoginToken().then(LoginToken => {
            const b64encoded = btoa(String.fromCharCode.apply(null, LoginToken.token)).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
            const url = "tg://login?token=" + b64encoded;

            this.setState({
                isLoading: false,
            });

            this.refreshCanvas(url).then(() => {
                this.withTimeout(this.refreshToken, 1000 * (LoginToken.expires - (new Date()).getTime() / 1000));
            });
        });
    }

    exportLoginToken = () => {
        return API.auth.exportLoginToken().catch(error => {
            if (error.type === "SESSION_PASSWORD_NEEDED") {
                loginState.setPasswordView();
            }

            throw error;
        });
    }

    refreshCanvas = (data: string) => {
        return this.createQrCanvas(data).then($canvas => {
            this.setCanvas($canvas);
        });
    }

    setCanvas = ($canvas: HTMLCanvasElement) => {
        this.containerRef.$el.firstElementChild?.remove();
        this.containerRef.$el.appendChild($canvas);
    }

    createQrCanvas = (data): Promise<HTMLCanvasElement> => {
        return import("qr-code-styling").then(QRCodeStyling => {
            return new QRCodeStyling.default({
                width: 240,
                height: 240,
                data: data,
                image: "./static/images/logo.svg",
                dotsOptions: {
                    color: "#000000",
                    type: "rounded"
                },
                imageOptions: {
                    imageSize: 0.5
                },
                backgroundOptions: {
                    color: "#ffffff",
                },
                qrOptions: {
                    errorCorrectionLevel: "L"
                }
            })._canvas._canvas;
        })
    }
}

export default LoginQRComponent;