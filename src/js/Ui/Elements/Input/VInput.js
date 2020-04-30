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

function VInput(
    {
        type = "text",
        width = "auto",
        name = null,
        label = "",
        onInput,
        onFocus,
        value,
        isError = false,
        error,
        isSuccess = false,
        success,
        disabled = false
    }
) {
    let text = label;

    if (isError) {
        isSuccess = false
        text = error;
    } else if (isSuccess) {
        isError = false;
        text = success || label;
    }

    return (
        <div className="VInput" css-width={width}>
            <input disabled={disabled ? "true" : undefined}
                   className={{"invalid": isError, "success": isSuccess}}
                   type={type}
                   placeholder={text}
                   name={name}
                   value={value}
                   onInput={onInput}
                   onFocus={onFocus}/>

            <label htmlFor={name}>{text}</label>
        </div>
    );
}

export default VInput