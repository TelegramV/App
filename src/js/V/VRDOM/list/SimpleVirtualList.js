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

import StatefulComponent from "../component/StatefulComponent"

class SimpleVirtualList extends StatefulComponent {
    state = {
        start: 0,
        count: 0,
        offsetY: 0,
        totalHeight: null,
    };

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
                    "will-change": "transform",
                }}>
                    <div style={{
                        "will-change": "transform",
                        "transform": `translateY(${offsetY}px)`
                    }}>
                        {items.slice(start, start + count).map(item => template(item))}
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        console.log(this, "mounted")
        this.$el.addEventListener("scroll", this.onScroll, {
            passive: true,
        });
        this.recalculate()
    }

    componentWillUnmount() {
        this.$el.removeEventListener("scroll", this.onScroll)
    }

    componentDidUpdate() {
        this.recalculate();
    }

    onScroll = this.throttle(() => {
        this.recalculate()
    }, 100);

    recalculate = () => {
        let {items, itemHeight, renderAhread} = this.props;

        let containerHeight = this.props.containerHeight;

        if (!containerHeight) {
            if (!this.state.containerHeight) {
                this.state.containerHeight = this.$el.parentElement.clientHeight;
            }

            containerHeight = this.state.containerHeight;
        }

        const scrollTop = this.$el.scrollTop;

        let start = Math.floor(scrollTop / itemHeight) - renderAhread;
        start = Math.max(0, start);

        let count = Math.ceil(containerHeight / itemHeight) + 2 * renderAhread;
        count = Math.min(items.length - start, count);

        const offsetY = start * itemHeight;

        const totalHeight = items.length * itemHeight;

        this.setState({
            start,
            count,
            offsetY,
            totalHeight
        })
    }
}

SimpleVirtualList.defaultProps = {
    containerHeight: null,
    renderAhread: 10,
    items: [],
}

export default SimpleVirtualList