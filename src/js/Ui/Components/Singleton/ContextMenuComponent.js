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

import VUI from "../../VUI"
import {callOrReturn} from "../../../Utils/func"
import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf"
import classNames from "../../../V/VRDOM/jsx/helpers/classNames"
import classIf from "../../../V/VRDOM/jsx/helpers/classIf"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import UIEvents from "../../EventBus/UIEvents"

class ContextMenuComponent extends StatefulComponent {

    state = {
        hidden: false,
        unhidden: false,
        reallyHidden: true,
        data: [],
        x: 0,
        y: 0,
        animation: "left-top",
    }

    init() {
        VUI.ContextMenu = this
    }

    render() {
        return (
            <div
                // css-display={this.state.hidden && "none"}
                className={classNames("context-menu-wrapper", classIf(this.state.hidden, "hidden"), classIf(this.state.unhidden, "unhidden"), classIf(this.state.reallyHidden, "really-hidden"))}
                onClick={this.close}
                onContextMenu={this.close}
                onAnimationEnd={this.onTransitionEnd}>

                <div className={classNames("context-menu", this.state.animation)}
                     css-top={this.state.y + "px"}
                     css-left={this.state.x + "px"}>

                    {
                        this.state.data.map(item => {
                                item = callOrReturn(item)
                                item.icon = callOrReturn(item.icon)
                                item.title = callOrReturn(item.title)

                                return (
                                    <div className={classNames("element", "rp", "rps", classIf(item.red, "red"))}
                                         onClick={event => this.select(item, event)}>

                                        {nodeIf(() => <i
                                            className={classNames("tgico", `tgico-${item.icon}`)}/>, item.icon)}

                                        <span>{item.title}</span>

                                        {nodeIf(() => <div className="badge">{item.counter}</div>, item.counter)}
                                        {nodeIf(() => <div className="after">{item.after}</div>, item.after)}

                                    </div>
                                )
                            }
                        )
                    }
                </div>
            </div>
        )
    }

    onTransitionEnd = (ev) => {
        if (ev.animationName === "hidden-context") {
            this.setState({
                reallyHidden: true
            })
        }
    }

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
    }

    onKeyDown = event => {
        if (!this.state.hidden) {
            event.stopPropagation();

            const code = event.keyCode || event.which;

            if (code === 27) {
                this.close(event);
            }
        }
    }

    select = (item, event) => {
        if (item.onClick) {
            item.onClick()
        }

        event.stopPropagation()

        this.close()
    }

    close = () => {
        this.setState({
            hidden: true,
            unhidden: false
        })

        UIEvents.General.fire("context.close");
    }

    open = (data = []) => {
        this.setState({
            data,
            hidden: false,
            unhidden: true,
            reallyHidden: false
        })
    }

    openXY = (data, x, y, origin = "left-top") => {
        // TODO replace that with not hardcoded values
        const width = 220
        const height = data.length * 64
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        const clientWidth = document.querySelector("#app").clientWidth
        const clientHeight = document.querySelector("#app").clientHeight
        x -= (windowWidth - clientWidth) / 2
        y -= (windowHeight - clientHeight) / 2

        this.state.animation = origin
        if (x + width >= windowWidth) {
            x = x - width
            this.state.animation = "right-top"
        }
        if (y + height >= windowHeight) {
            y = y - height
            if (this.state.animation === "right-top") {
                this.state.animation = "right-bottom"
            } else {
                this.state.animation = "left-bottom"
            }

            if(y <= 0) {
                y = 0
            }
        }
        this.state.x = x
        this.state.y = y

        this.open(data)
    }

    openCenter = (data = [], elem) => {
        let rect = elem.getBoundingClientRect()
        this.openXY(data, rect.x + rect.width / 2, rect.y + rect.height / 2)
    }

    openBelow = (data = [], elem, origin) => {
        let rect = elem.getBoundingClientRect()
        let x = rect.x;
        let y = rect.y;
        if (origin && origin.includes("right")) {
            x = x - 220 + rect.width; //Макс, винеси довжину в змінну
        }
        this.openXY(data, x, y + rect.height + 10, origin)
    }


    openAbove = (data = [], elem, origin) => {
        let rect = elem.getBoundingClientRect()
        this.openXY(data, rect.x, rect.y - 10, origin)
    }

    listener = (data = []) => {
        if (!data) {
            return () => {
            };
        } // empty context menu blocks scroll
        return event => {
            event.preventDefault()
            this.openXY(callOrReturn(data), event.clientX - document.querySelector("#app").getBoundingClientRect().x, event.clientY);
        }
    }
}

if (__IS_PRODUCTION__) {
    window.oncontextmenu = function (ev) {
        ev.preventDefault()
    }
}

export default ContextMenuComponent