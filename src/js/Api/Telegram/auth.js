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

import {AppConfiguration} from "../../Config/AppConfiguration"
import MTProto from "../../MTProto/External"

const sendCode = (phoneNumber, dcId = null) => {
    return MTProto.invokeMethod("auth.sendCode", Object.assign({
        phone_number: phoneNumber,
        api_id: AppConfiguration.mtproto.api.api_id,
        api_hash: AppConfiguration.mtproto.api.api_hash,
        settings: {
            _: "codeSettings",
            current_number: false,
            allow_app_hash: false,
            allow_flashcall: false
        },
        lang_code: navigator.language || 'en'
    }), dcId)
}

const signIn = (phoneNumber, phoneCodeHash, phoneCode, dcId = null) => {
    return MTProto.invokeMethod("auth.signIn", Object.assign({
        phone_number: phoneNumber,
        phone_code_hash: phoneCodeHash,
        phone_code: phoneCode
    }), dcId)
}

const signUp = (phoneNumber, phoneCodeHash, firstName, lastName) => {
    return MTProto.invokeMethod("auth.signUp", Object.assign({
        phone_number: phoneNumber,
        phone_code_hash: phoneCodeHash,
        first_name: firstName,
        last_name: lastName
    }))
}

function checkPassword(password) {
    return MTProto.invokeMethod("auth.checkPassword", {
        password
    });
}

function exportLoginToken(props = {}) {
    return MTProto.invokeMethod("auth.exportLoginToken", {
        ...{
            api_id: AppConfiguration.mtproto.api.api_id,
            api_hash: AppConfiguration.mtproto.api.api_hash,
            except_ids: []
        },
        ...props,
    });
}

const auth = {
    sendCode: sendCode,
    signIn: signIn,
    signUp: signUp,
    checkPassword: checkPassword,
    exportLoginToken: exportLoginToken,
}

export default auth