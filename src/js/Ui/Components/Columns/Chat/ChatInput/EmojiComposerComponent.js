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

import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"
import {emojiCategories, replaceEmoji} from "../../../../Utils/replaceEmoji"
import {ChatInputManager} from "./ChatInputComponent"

class EmojiComposerComponent extends StatelessComponent {
    emojiCategory = "people"
    emojiCategories = [
        {name: "recent", icon: "sending"},
        {name: "people", icon: "smile"},
        {name: "nature", icon: "animals"},
        {name: "food", icon: "eats"},
        {name: "travel", icon: "car"},
        {name: "activity", icon: "sport"},
        {name: "objects", icon: "lamp"},
        {name: "symbols", icon: "flag"},
    ]

    render(props) {
        return (
            <div className="emoji-wrapper">
                <div className="emoji-table">
                    {this.emojiCategories.map(category => (
                        <div className={`${category.name} scrollable`} data-category={category.name}/>
                    ))}
                </div>
                <div className="emoji-types">
                    {this.emojiCategories.map(category => (
                        <div className="rp rps emoji-type-item"
                             data-category={category.name}
                             onClick={this.onClickSwitchEmojiCategory}>
                            <i className={`tgico tgico-${category.icon}`}/>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    componentDidMount() {
        const $selected = this.$el.querySelector(".emoji-table").querySelector(".people");
        $selected.classList.add("selected");
        $selected.innerText = emojiCategories["people"];
        replaceEmoji($selected);
        this.$el.querySelector(`.emoji-types > [data-category=people]`).classList.add("selected");
        this.$el.querySelector(".emoji-table > .selected").childNodes.forEach(node => {
            node.addEventListener("click", this.onClickEmoji);
        });
    }

    // DOM hell
    onClickSwitchEmojiCategory = (ev) => {
        const $el = ev.currentTarget;
        const category = $el.getAttribute("data-category");

        if (!category || this.emojiCategory === category) {
            return;
        }

        this.emojiCategory = category;

        this.$el.querySelector(".emoji-types").childNodes
            .forEach(node => node.classList.remove("selected"));

        $el.classList.add("selected");

        this.$el.querySelector(".emoji-table").childNodes
            .forEach(node => node.classList.remove("selected"));

        const $emojiPanel = this.$el.querySelector(".emoji-table")
            .querySelector("." + category);

        $emojiPanel.classList.add("selected");

        if ($emojiPanel.childElementCount === 0) {
            $emojiPanel.innerText = emojiCategories[category];

            replaceEmoji($emojiPanel);

            this.$el.querySelector(".emoji-table > .selected").childNodes.forEach(node => {
                node.addEventListener("click", this.onClickEmoji);
            });
        }
    }

    onClickEmoji = (ev) => {
        ChatInputManager.appendText(ev.currentTarget.alt);
    }
}

export default EmojiComposerComponent