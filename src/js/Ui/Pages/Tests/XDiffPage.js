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

import VInput from "../../Elements/Input/VInput";
import Component from "../../../V/VRDOM/xpatch/xComponent"
import VCheckbox from "../../Elements/Input/VCheckbox"

class In extends Component {
    state = {
        value: "",
    };

    render() {
        return <VCheckbox checked={this.state.isChecked} onClick={() => {
            this.setState({
                isChecked: !this.state.isChecked,
            });
        }}/>
    }
}

class XComponent extends Component {
    divRef = {};
    inputRef = {};

    state = {
        value: "",
    };

    render() {
        if (this.state.value === "kk") {
            return <h1>lol</h1>
        }
        return (
            <div class="lol" ref={this.divRef}>
                <VInput ref={this.inputRef} value={this.state.value} onInput={event => this.setState({
                    value: event.target.value,
                })}/>

                {this.state.value && <div>{this.state.value}</div>}

                <In/>
            </div>
        )
    }

    componentDidMount() {
        console.warn("did mount", this)
        console.log(this.$el, this.divRef, this.inputRef)
    }

    componentDidUpdate() {
        console.warn("did update", this)
        console.log(this.$el)
    }
}


export function XDiffPage() {
    return <div>
        <XComponent/>
    </div>
}