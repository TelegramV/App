/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {AppConfiguration} from "../../Config/AppConfiguration"
import MTProto from "../../MTProto/external"

const sendCode = (phoneNumber) => {
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
    }))
}

const signIn = (phoneNumber, phoneCodeHash, phoneCode) => {
    return MTProto.invokeMethod("auth.signIn", Object.assign({
        phone_number: phoneNumber,
        phone_code_hash: phoneCodeHash,
        phone_code: phoneCode
    }))
}

const signUp = (phoneNumber, phoneCodeHash, firstName, lastName) => {
    return MTProto.invokeMethod("auth.signUp", Object.assign({
        phone_number: phoneNumber,
        phone_code_hash: phoneCodeHash,
        first_name: firstName,
        last_name: lastName
    }))
}

const auth = {
    sendCode: sendCode,
    signIn: signIn,
    signUp: signUp,
}

export default auth