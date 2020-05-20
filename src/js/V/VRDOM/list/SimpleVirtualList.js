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

import StatefulComponent from "../component/StatefulComponent"

class SimpleVirtualList extends StatefulComponent {
    state = {
        start: 0,
        count: 0,
        offsetY: 0,
        totalHeight: null,
    };

    render() {
        const {containerHeight, items, template, itemHeight} = this.props;
        const {start, count, offsetY, totalHeight} = this.state;

        return (
            <div style={{
                height: `${containerHeight}px`,
                overflow: "auto"
            }}>

                <div style={{
                    overflow: "hidden",
                    willChange: "transform",
                    height: `${totalHeight || items.length * itemHeight}px`,
                    position: "relative"
                }}>
                    <div style={{
                        willChange: "transform",
                        transform: `translateY(${offsetY}px)`
                    }}>
                        {items.slice(start, start + count).map(item => template(item))}
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.$el.addEventListener("scroll", this.onScroll)
        this.recalculate()
    }

    componentWillUnmount() {
        this.$el.removeEventListener("scroll", this.onScroll)
    }

    onScroll = event => {
        this.recalculate()
    }

    recalculate = () => {
        const {containerHeight, items, itemHeight, renderAhread} = this.props;
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
    containerHeight: 100,
    renderAhread: 10,
    items: [],
}

export default SimpleVirtualList