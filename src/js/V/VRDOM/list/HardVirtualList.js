/*
 * Telegram V
 * Copyright (C) 2020 Davyd Kohut
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