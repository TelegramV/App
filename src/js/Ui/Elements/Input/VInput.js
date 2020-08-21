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

import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import List from "../../../V/VRDOM/list/List"
import classIf from "../../../V/VRDOM/jsx/helpers/classIf";

function VInput(
    {
        id,
        type = "text",
        width = "auto",
        name = null,
        label = "",
        onInput,
        onKeyPress,
        onFocus,
        onBlur,
        value,
        autoFocus,
        error,
        success,
        filledText, // shows on top when something is in input
        disabled = false,
        rotate180 = false,
        onButtonClick,
        onKeyDown,
        withButton = false,
        buttonIcon = "eye1",
        maxLength,
    }
) {
    let text = label;

    if (error) {
        success = false;
        text = error;
    } else if (success) {
        error = false;
        text = success || label;
    }

    return (
        <div className={{
            "VInput": true,
            "withButton": withButton,
        }} css-width={width}>
            {
                withButton && <i className={`btn-icon rp rps tgico tgico-${buttonIcon} ` + (rotate180 ? "rotate180" : "")} onClick={onButtonClick}/>
            }

            <input id={id}
                   disabled={disabled ? "true" : undefined}
                   className={{"invalid": error, "success": success}}
                   type={type}
                   placeholder={text}
                   name={name}
                   value={value}
                   onInput={onInput}
                   onKeyPress={onKeyPress}
                   onBlur={onBlur}
                   onFocus={onFocus}
                   autoFocus={autoFocus}
                   maxLength={maxLength}
                   onKeyDown={onKeyDown}
                   tabindex="-1"
            />

            <label htmlFor={name}>{(value && filledText) ? filledText : text}</label>
        </div>
    );
}

export class VInputValidate extends StatelessComponent {
    value = this.props.value;

    render(props) {
        const onInput = props.onInput;

        props.onInput = event => {
            const validated = this.onInput(event);

            if (validated === event) {
                onInput(event);
            }
        }

        if (props.type === "number") {
            // prevent non-digit values
            props.onKeyPress = event => event.keyCode === 8 || event.keyCode === 46 ? true : !isNaN(Number(event.key));
        }

        return (
            <VInput {...{...props, filter: undefined}}/>
        );
    }

    componentDidUpdate() {
        this.value = this.props.value
    }

    onInput = (event: { target: HTMLInputElement; }) => {
        const filter = this.props.filter;

        if (filter) {
            const value = event.target.value;
            const previousValue = this.value || "";

            if (filter(value)) {
                this.value = value;
                return event;
            } else {
                event.target.value = this.value;
                return false;
            }
        }
    }
}

export class VInputPassword extends StatefulComponent {
    state = {
        isShown: this.props.isShown ?? false,
    }

    render(props, {isShown}) {
        props = {
            ...props,
            type: isShown ? "text" : "password",
            buttonIcon: isShown ? "eye2" : "eye1",
            withButton: true,
        }

        return (
            <VInput {...props} onButtonClick={() => {
                this.setState({
                    isShown: !isShown,
                });

                if (props.onShownUpdate) {
                    props.onShownUpdate(!isShown);
                }
            }}/>
        );
    }
}

export class VInputDropdown extends StatefulComponent {
    state = {
        isShown: this.props.isShown ?? false,
        inputValue: "",
    }

    render(props, {isShown, inputValue}) {
        props = {
            ...props,
            // buttonIcon: isShown ? "up" : "down",
            buttonIcon: "down",
            rotate180: !!isShown,
            withButton: true,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            onInput: this.onInput,
        }

        return (
            <div className="VInputDropdown">
                <VInput {...props} value={inputValue || props.currentValue} onButtonClick={this.onButtonClick}/>

                <div className={{"VInputDropdownList": true, "hidden": !isShown || props.disabled}}>
                    <List template={props.template}
                          wrapper={<div/>}
                          list={props.items}/>
                </div>
            </div>
        );
    }

    onInput = (event: InputEvent) => {
        const input = event.target.value.trim();

        const $nodes = this.$el.querySelector(`.VInputDropdownList`).firstElementChild.childNodes;

        $nodes.forEach(($node, index) => {
            if (this.props.filter(input, this.props.items.items[index])) {
                $node.classList.remove("hidden");
            } else {
                $node.classList.add("hidden");
            }
        });
    }

    onFocus = () => {
        this.setState({
            isShown: !this.props.disabled,
        });
    }

    onBlur = (event) => {
        this.setState({
            isShown: false,
        });
    }

    onButtonClick = () => {
        this.setState({
            isShown: !this.state.isShown,
        });

        if (this.props.onShownUpdate) {
            this.props.onShownUpdate(this.state.isShown);
        }
    }

    setCurrent = item => {
        this.setState({
            isShown: false,
            inputValue: item.name,
        })
    }
}

export default VInput