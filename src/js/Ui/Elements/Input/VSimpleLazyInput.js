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

class VSimpleLazyInput extends StatefulComponent {
    lazyLevel = this.props.lazyLevel || 1000;
    value = this.props.value;

    render() {
        return (
            <input type={this.props.type}
                   onInput={this.onInput}
                   onFocus={this.props.onFocus}
                   placeholder={this.props.placeholder}
                   tabindex="-1"
            />
        );
    }

    onInput = (event) => {
        if (this.props.fireEmpty && event.target.value === "") {
            this.clearTimeouts();

            this.props.onInput(event);
        } else if (!this.value !== event.target.value) {
            this.value = event.target.value;

            this.clearTimeouts();

            this.withTimeout(() => {
                if (!this.value !== event.target.value) {
                    this.props.onInput(event);
                }
            }, this.lazyLevel);
        }
    }
}

VSimpleLazyInput.defaultProps = {
    type: "text",
    fireEmpty: true,
}

export default VSimpleLazyInput