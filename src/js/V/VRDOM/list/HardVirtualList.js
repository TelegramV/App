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

import VComponent from "../component/VComponent"
import vrdom_append from "../append"
import vrdom_prepend from "../prepend"
import vrdom_delete from "../delete"
import StatelessComponent from "../component/StatelessComponent"

// Чорновий варіат, НЕ ЮЗАТИ
class HardVirtualList extends StatelessComponent {

    page = {
        number: 0,
        initial: 50
    }

    itemsContainer = VComponent.createRef()

    render() {
        let {containerHeight, items, template} = this.props;

        if (typeof containerHeight === "number") {
            containerHeight = `${containerHeight}px`
        }

        return (
            <div style={{
                height: containerHeight,
                overflow: "auto"
            }}>
                <div style={{
                    overflow: "hidden",
                    willChange: "transform",
                    position: "relative"
                }}>
                    <div style={{
                        willChange: "transform",
                    }} ref={this.itemsContainer}>
                        {items.slice(this.page.number * this.page.initial, this.page.number * this.page.initial + this.page.initial).map(item => template(item))}
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.$el.addEventListener("scroll", this.onScroll)
    }

    onScroll = (event: Event) => {
        const $el = event.target;
        const {scrollTop, scrollHeight, clientHeight} = $el;
        const isAtBottom = scrollHeight - scrollTop === clientHeight;

        // console.log(scrollTop, scrollHeight, clientHeight)

        if (isAtBottom) {
            this.renderNextPage()
        } else if (scrollTop === 0) {
            this.renderPrevPage()
        }
    }

    renderNextPage = () => {
        console.log("next")
        const {items, template} = this.props;
        const {$el} = this.itemsContainer;

        ++this.page.number;

        items.slice(this.nextPageOffset(), this.nextPageOffset() + 30)
            .map(item => template(item))
            .forEach((item) => {
                vrdom_delete($el.firstChild);
                vrdom_append(item, $el);
            })
    }

    renderPrevPage = () => {
        if (this.page.number === 0) {
            return
        }

        const {items, template} = this.props;
        const {$el} = this.itemsContainer;

        let $first: HTMLElement = null

        items.slice(this.prevPageOffset(), this.prevPageOffset() + 30)
            .reverse()
            .map(item => template(item))
            .forEach((item) => {
                if (!$first) {
                    $first = vrdom_prepend(item, $el);
                } else {
                    vrdom_prepend(item, $el);
                }
                vrdom_delete($el.lastChild);
            })

        --this.page.number;

        this.$el.scrollTop = $first.offsetTop
    }

    nextPageOffset = () => {
        return this.page.number * 30 + (this.page.initial - 30)
    }

    prevPageOffset = () => {
        return this.page.number * 30 - 30
    }
}

export default HardVirtualList