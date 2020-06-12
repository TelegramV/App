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

import VArray from "../../../V/VRDOM/list/VArray"
import {countries} from "../../Utils/utils"
import State from "../../../V/VRDOM/component/State"
import {MonkeyController} from "./MonkeyController"
import VApp from "../../../V/vapp"

let sentCodeFromStorage = localStorage.getItem("auth.sentCode") ? JSON.parse(localStorage.getItem("auth.sentCode")) : false;

if (sentCodeFromStorage) {
    if ((sentCodeFromStorage.__time + 60000) < (new Date().getTime())) {
        sentCodeFromStorage = false;
        localStorage.removeItem("auth.sentCode")
    }
}

class LoginState extends State {
    stage = sentCodeFromStorage ? "code" : "phone";

    countries = new VArray(countries.map(country => {
        return {
            flag: country[3],
            name: country[1],
            code: country[0]
        }
    }));

    phone = sentCodeFromStorage?.__phone || "";
    country = null;
    keepMeSignedIn = false;

    monkey = new MonkeyController();

    sentCode = sentCodeFromStorage;
    authorization = null;
    accountPassword = null;

    setPhoneInputView() {
        sentCodeFromStorage = null;

        localStorage.removeItem("auth.sentCode");

        this.set({
            stage: "phone",
            sentCode: null,
        });
    }

    setRegisterView() {
        sentCodeFromStorage = null;
        localStorage.removeItem("auth.sentCode");

        this.set({
            stage: "register",
        });
    }

    setPasswordView() {
        sentCodeFromStorage = null;
        localStorage.removeItem("auth.sentCode");

        this.set({
            stage: "password",
        });
    }

    setQRView() {
        sentCodeFromStorage = null;
        localStorage.removeItem("auth.sentCode");

        this.set({
            stage: "qr",
        });
    }

    setCodeView() {
        sentCodeFromStorage = null;
        localStorage.removeItem("auth.sentCode");

        this.set({
            stage: "code",
        });
    }

    authorized(authorization = null) {
        if (authorization) {
            this.authorization = authorization;
        }

        if (this.authorization && this.authorization._ === "auth.authorization") {
            localStorage.setItem("user", this.authorization.user.id);
            localStorage.removeItem("auth.sentCode");
            localStorage.removeItem("account.password");
            VApp.router.replace("/");
        }
    }
}

export default new LoginState();