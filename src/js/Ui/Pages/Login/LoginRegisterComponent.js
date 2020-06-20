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
import VButton from "../../Elements/Button/VButton"
import {askForFile} from "../../Utils/utils"
import VUI from "../../VUI"
import API from "../../../Api/Telegram/API"
import {FileAPI} from "../../../Api/Files/FileAPI"

class LoginRegisterComponent extends StatefulComponent {
    globalState = {
        login: loginState,
    };

    state = {
        name: "",
        lastName: "",

        nameError: null,
        lastNameError: null,

        isLoading: false,

        avatarUrl: "",
        avatarBytes: null,
    }

    render(props, {name, lastName, isLoading, avatarUrl, lastNameError, nameError}, {}) {
        return (
            <div className="panel register-panel">
                <div className="object picture rp rps" style={{
                    "background-image": `url(${avatarUrl})`
                }} onClick={() => this.addPicture()}>
                    <div className={{"tint": true, "hidden": !avatarUrl}}/>
                    <i className={`add-icon tgico tgico-${avatarUrl ? "camera" : "cameraadd"}`}/>
                </div>

                <div className="login-page-header">
                    <span className="login-page-header-title">
                        Your name
                    </span>
                    <span className="login-page-header-subtitle">
                        Enter your name and add a profile picture
                    </span>
                </div>

                <form onSubmit={event => event.preventDefault()} className="login-page-inputs">
                    <VInput label="Name"
                            value={name}
                            error={nameError}
                            onInput={this.onInputName}/>

                    <VInput label="Last Name (optional)"
                            value={lastName}
                            error={lastNameError}
                            onInput={this.onInputLastName}/>

                    <VButton isBlock
                             isLoading={isLoading}
                             disabled={isLoading || null}
                             type="submit"
                             onClick={this.onClickSignUp}>
                        {isLoading ? "Please wait..." : "Start messaging"}
                    </VButton>
                </form>
            </div>
        )
    }

    onInputName = (event: InputEvent) => {
        const name = event.target.value.trim();

        this.setState({
            name,
            nameError: null,
        });
    }

    onInputLastName = (event: InputEvent) => {
        const lastName = event.target.value.trim();

        this.setState({
            lastName,
            lastNameError: null,
        });
    }

    onClickSignUp = () => {
        if (this.state.name.length < 1) {
            return;
        }

        this.setState({
            isLoading: true,
        });

        const {name, lastName, avatarBytes} = this.state;

        API.auth.signUp(loginState.phone, loginState.sentCode.phone_code_hash, name, lastName).then(Authorization => {
            if (avatarBytes instanceof Uint8Array) {
                FileAPI.uploadProfilePhoto("avatar.jpg", avatarBytes);
            }

            loginState.authorized(Authorization);
        }).catch(error => {
            this.setState({
                isLoading: false,
            });

            if (error.type === "FIRSTNAME_INVALID") {
                this.setState({
                    nameError: "Invalid name",
                });
            } else if (error.type === "LASTNAME_INVALID") {
                this.setState({
                    lastNameError: "Invalid last name",
                });
            } else {
                this.setState({
                    nameError: error.type,
                });
            }
        });
    }

    addPicture = () => {
        import("croppie").then(croppie => {
            const Croppie = croppie.default;

            askForFile("image/*", buffer => {
                const url = URL.createObjectURL(new Blob([buffer]));

                const onCroppieDone = () => {
                    this.state.cropper.result({
                        type: "base64",
                    }).then((base) => {
                        const bytes = Uint8Array.from(atob(base.split(",")[1]), c => c.charCodeAt(0));
                        const blob = new Blob([bytes], {type: "image/png"});
                        const url = URL.createObjectURL(blob);

                        this.setState({
                            avatarUrl: url,
                            avatarBytes: bytes,
                        });

                        VUI.Modal.close();
                    });
                }

                VUI.Modal.open(
                    <div id="cropperModal" className="body">
                        <div id="cropper"/>
                        <div className="done-button rp" onClick={onCroppieDone}>
                            <i className="tgico tgico-check"/>
                        </div>
                    </div>
                );

                this.state.cropper = new Croppie(document.querySelector("#cropper"), {
                    enableExif: true,
                    showZoomer: false,
                    viewport: {
                        width: 310,
                        height: 310,
                        type: "circle",
                    },
                    boundary: {
                        width: 350,
                        height: 350,
                    },
                    url,
                });

                this.setState({
                    avatarUrl: url,
                    avatarBytes: new Uint8Array(buffer),
                });
            }, true)
        })
    }
}

export default LoginRegisterComponent;