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