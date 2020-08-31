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

import StatefulComponent from "../component/StatefulComponent";
import VComponent from "../component/VComponent";
import vrdom_delete from "../delete";
import vrdom_append from "../append";

class FastVirtualList extends StatefulComponent {
    state = {
        start: 0,
        count: 0,
        offsetY: 0,
        totalHeight: null,
    };

    offsetContainerRef = VComponent.createRef();

    render() {
        const {items, template, itemHeight, ...otherProps} = this.props;
        const {start, count, offsetY, totalHeight} = this.state;

        const containerHeight = this.props.containerHeight || this.state.containerHeight;

        return (
            <div style={{
                "height": `${containerHeight}px`,
                "overflow": "auto",
                "will-change": "transform",
            }} {...otherProps}>

                <div style={{
                    "overflow": "hidden",
                    "height": `${totalHeight || items.length * itemHeight}px`,
                    "position": "relative",
                }}>
                    <div style={{
                        "transform": `translateY(${offsetY}px)`
                    }} ref={this.offsetContainerRef}>
                        {items.slice(start, start + count).map(item => template(item))}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.$el.addEventListener("scroll", this.onScroll, {
            passive: true,
        });

        this.setState(this.calculate());
    }

    componentWillUnmount() {
        this.$el.removeEventListener("scroll", this.onScroll);
    }

    componentDidUpdate() {
        this.setState(this.calculate());
    }

    onScroll = this.props.scrollThrottle ? this.throttle((event) => {
        this.onScrollHandler();
        this.props.onScroll(event);
    }, this.props.scrollThrottle) : (event) => {
        this.onScrollHandler(event);
        this.props.onScroll(event);
    };

    calculate = () => {
        let {items, itemHeight, renderAhread, template} = this.props;

        let containerHeight = this.props.containerHeight;

        if (!containerHeight) {
            //if (!this.state.containerHeight) { // Doesn't react on parent element resize
            this.state.containerHeight = this.$el.parentElement.clientHeight;
            //}

            containerHeight = this.state.containerHeight;
        }

        const scrollTop = this.$el.scrollTop;

        let start = Math.floor(scrollTop / itemHeight) - renderAhread;
        start = Math.max(0, start);

        let count = Math.ceil(containerHeight / itemHeight) + 2 * renderAhread;
        count = Math.min(items.length - start, count);

        const offsetY = start * itemHeight;

        const totalHeight = items.length * itemHeight;

        return {
            start,
            count,
            offsetY,
            totalHeight
        };
    };

    onScrollHandler = () => {
        this.setState(this.calculate());
        return;

        const {
            start,
            count,
            offsetY,
            totalHeight
        } = this.calculate();

        const {items, template} = this.props;

        const startDiff = start - this.state.start;

        if (startDiff === 0) {
            return;
        }

        const currentItems = items.slice(start, start + count);

        const $el = this.offsetContainerRef.$el;

        console.log(start, count, this.state.start, this.state.count);

        Object.assign({
            start,
            count,
            offsetY,
            totalHeight
        });

        // if (startDiff <= 0) {
        // return this.setState({
        //     start,
        //     count,
        //     offsetY,
        //     totalHeight
        // });
        // } else {
        for (let i = 0; i < start; i++) {
            vrdom_delete($el.firstChild);
            vrdom_append(template(currentItems[currentItems.length - 1 - i]), $el);
        }

        $el.style.transform = `translateY(${offsetY}px)`;
        $el.parentElement.style.height = totalHeight;
        // }

    };
}

FastVirtualList.defaultProps = {
    containerHeight: null,
    renderAhread: 5,
    items: [],
    scrollThrottle: 50,
    onScroll: () => {
    },
};

export default FastVirtualList;