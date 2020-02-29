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

import VComponent from "../../../V/VRDOM/component/VComponent"
import classNames from "../../../V/VRDOM/jsx/helpers/classNames"
import classIf from "../../../V/VRDOM/jsx/helpers/classIf"

export default class TabSelectorComponent extends VComponent {
    componentDidMount() {
        this.updateFragments(this.props.items)
    }

    updateFragments = (items) => {
        this.props.items = items
        this.fragments = [];

        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            if (item.selected) {
                this.state.selected = i;
            }

            this.fragments.push(<TabSelectorItemFragment tabIndex={i} text={item.text}
                                                         click={this.itemClick}
                                                         hidden={!!item.hidden}
                                                         selected={!!item.selected}/>)
        }

        this.forceUpdate()
    }

    render = () => {
        return (
            <div className="tab-selector">
                {this.fragments}
            </div>
        )
    }

    itemClick = (ev) => {
        let el = ev.currentTarget;
        let index = el.getAttribute("tab-index");
        this.state.selected = index;
        this.removeSelected();
        this.$el.childNodes[index].classList.add("selected");
        let callback = this.props.items[index].click;
        if (callback) {
            callback();
        }
    }

    removeSelected = () => {
        for (const item of this.$el.childNodes) {
            item.classList.remove("selected");
        }
    }
}

const TabSelectorItemFragment = ({selected = false, text, hidden = false, tabIndex = -1, click}) => {
    const classes = classNames(
        "item", "rp",
        classIf(selected, "selected"),
        classIf(hidden, "hidden")
    )

    return (
        <div tab-index={tabIndex}
             className={classes}
             onClick={click}>

            <span>{text}</span>
        </div>
    )
}
