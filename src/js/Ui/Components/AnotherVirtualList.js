import StatefulComponent from "../../V/VRDOM/component/StatefulComponent"
import VComponent from "../../V/VRDOM/component/VComponent"
import {throttleWithRAF} from "../../Utils/func"

const getElementTop = (element) => {
    if (element.pageYOffset) return element.pageYOffset;

    if (element.document) {
        if (element.document.documentElement && element.document.documentElement.scrollTop) return element.document.documentElement.scrollTop;
        if (element.document.body && element.document.body.scrollTop) return element.document.body.scrollTop;

        return 0;
    }

    return element.scrollY || element.scrollTop || 0;
};

const defaultMapToVirtualProps = ({
                                      items,
                                      itemHeight,
                                  }, {
                                      firstItemIndex,
                                      lastItemIndex,
                                  }) => {
    const visibleItems = lastItemIndex > -1 ? items.slice(firstItemIndex, lastItemIndex + 1) : [];

    // style
    const height = items.length * itemHeight;
    const paddingTop = firstItemIndex * itemHeight;

    return {
        virtual: {
            items: visibleItems,
            style: {
                'height': height + 'px',
                'padding-top': paddingTop + 'px',
                'box-sizing': 'border-box',
            },
        }
    };
}

const getVisibleItemBounds = (list, container, items, itemHeight, itemBuffer) => {
    // early return if we can't calculate
    if (!container) return undefined;
    if (!itemHeight) return undefined;
    if (!items) return undefined;
    if (items.length === 0) return undefined;

    // what the user can see
    const {innerHeight, clientHeight} = container;

    const viewHeight = innerHeight || clientHeight; // how many pixels are visible

    if (!viewHeight) return undefined;

    const viewTop = getElementTop(container); // top y-coordinate of viewport inside container
    const viewBottom = viewTop + viewHeight;

    const listTop = topFromWindow(list) - topFromWindow(container); // top y-coordinate of container inside window
    const listHeight = itemHeight * items.length;

    // visible list inside view
    const listViewTop = Math.max(0, viewTop - listTop); // top y-coordinate of list that is visible inside view
    const listViewBottom = Math.max(0, Math.min(listHeight, viewBottom - listTop)); // bottom y-coordinate of list that is visible inside view

    // visible item indexes
    const firstItemIndex = Math.max(0, Math.floor(listViewTop / itemHeight) - itemBuffer);
    const lastItemIndex = Math.min(items.length, Math.ceil(listViewBottom / itemHeight) + itemBuffer) - 1;

    return {
        firstItemIndex,
        lastItemIndex,
    };
};
const topFromWindow = (element) => {
    if (typeof element === 'undefined' || !element) return 0;

    return (element.offsetTop || 0) + topFromWindow(element.offsetParent);
};


const VirtualList = (options, mapVirtualToProps = defaultMapToVirtualProps) => (InnerComponent) => {
    return class vlist extends StatefulComponent {
        static defaultProps = {
            itemBuffer: 0,
        };

        _isMounted = false;

        constructor(props) {
            super(props);

            this.options = {
                container: typeof window !== 'undefined' ? window : undefined,
                ...options,
            };

            this.state = {
                firstItemIndex: 0,
                lastItemIndex: -1,
            };

            // initialState allows us to set the first/lastItemIndex (useful for server-rendering)
            if (options && options.initialState) {
                this.state = {
                    ...this.state,
                    ...options.initialState,
                };
            }

            // if requestAnimationFrame is available, use it to throttle refreshState
            if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
                this.refreshState = throttleWithRAF(this.refreshState, 500);
            }
        };

        setStateIfNeeded(list, container, items, itemHeight, itemBuffer, assign = false) {
            // get first and lastItemIndex
            const state = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer);

            if (state === undefined) {
                return;
            }

            if (state.firstItemIndex > state.lastItemIndex) {
                return;
            }

            if (state.firstItemIndex !== this.state.firstItemIndex || state.lastItemIndex !== this.state.lastItemIndex) {
                if (assign) {
                    Object.assign(this.state, state)
                } else {
                    this.setState(state);
                }
            }
        }

        refreshState = () => {
            if (!this._isMounted) {
                return;
            }

            const {itemHeight, items, itemBuffer} = this.props;

            this.setStateIfNeeded(this.domNode, this.options.container, items, itemHeight, itemBuffer);
        };

        componentWillMount() {
            this._isMounted = true;
        }

        componentDidMount() {
            // cache the DOM node
            this.domNode = this.$el;

            // we need to refreshState because we didn't have access to the DOM node before
            this.refreshState();

            // add events
            this.options.container.addEventListener('scroll', this.refreshState, {
                // passive: true,
            });
            this.options.container.addEventListener('resize', this.refreshState, {
                // passive: true,
            });
        };

        componentWillUnmount() {
            this._isMounted = false;

            // remove events
            this.options.container.removeEventListener('scroll', this.refreshState);
            this.options.container.removeEventListener('resize', this.refreshState);
        };

        componentWillUpdate(nextProps, nextState) {
            const {itemHeight, items, itemBuffer} = nextProps;

            this.setStateIfNeeded(this.domNode, this.options.container, items, itemHeight, itemBuffer, true);
        }

        // if props change, just assume we have to recalculate
        // componentWillReceiveProps(nextProps) {
        //     const {itemHeight, items, itemBuffer} = nextProps;
        //
        //     this.setStateIfNeeded(this.domNode, this.options.container, items, itemHeight, itemBuffer);
        // };

        render() {
            return (<InnerComponent {...this.props} {...mapVirtualToProps(this.props, this.state)} />);
        };
    };
};

const makeItem = (i) => ({
    id: i,
    title: `Media heading #${i + 1}`,
    text: 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.',
});

export const ConfigurableExample = (MyList) => {
    let MyVirtualList = VirtualList()(MyList);

    return class MyConfigurableList extends StatefulComponent {
        constructor(config) {
            super(config);

            const defaultItemCount = 1000;

            const items = [];

            for (let i = 0; i < defaultItemCount; i++) {
                items[i] = makeItem(i);
            }

            this.state = {
                itemHeight: 100,
                itemCount: defaultItemCount,
                items: items,
                contained: false,
                containerHeight: 250,
                itemBuffer: 0,
            };
        };

        refs = {
            itemCount: VComponent.createRef(),
            contained: VComponent.createRef(),
            itemHeight: VComponent.createRef(),
            container: VComponent.createRef(),
            containerHeight: VComponent.createRef(),
            itemBuffer: VComponent.createRef(),
        }

        update = () => {
            const items = [];
            const itemCount = parseInt(this.refs.itemCount.$el.value, 10);

            for (var i = 0; i < itemCount; i++) {
                items[i] = makeItem(i);
            }


            const contained = this.refs.contained.$el.checked;

            const state = {
                itemHeight: parseInt(this.refs.itemHeight.$el.value, 10),
                itemCount: itemCount,
                items: items,
                contained: contained,
                container: this.refs.container.$el,
                containerHeight: parseInt(this.refs.containerHeight.$el.value, 10),
                itemBuffer: parseInt(this.refs.itemBuffer.$el.value, 10),
            };

            if (state.contained !== this.state.contained) {
                const options = {
                    container: state.contained ? state.container : window,
                };

                MyVirtualList = VirtualList(options)(MyList);
            }

            this.setState(state);
        };

        render() {
            console.log(this.state.itemBuffer)

            return (
                <div>
                    <div role="form" className="form-horizontal">
                        <div className="form-group">
                            <label className="col-xs-6 col-sm-2" htmlFor="contained">Contained</label>
                            <div className="col-xs-6 col-sm-4">
                                <input onInput={this.update} className="form-control" type="checkbox"
                                       checked={this.state.contained} id="contained" ref={this.refs.contained}/>
                            </div>
                            <label className="col-xs-6 col-sm-2" htmlFor="containerHeight">Container Height</label>
                            <div className="col-xs-6 col-sm-4">
                                <input onInput={this.update} className="form-control" type="number" min="0" max="10000"
                                       value={this.state.containerHeight} id="containerHeight"
                                       ref={this.refs.containerHeight}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-6 col-sm-2" htmlFor="itemHeight">Item Height</label>
                            <div className="col-xs-6 col-sm-4">
                                <input onInput={this.update} className="form-control" type="number" min="0"
                                       value={this.state.itemHeight} id="itemHeight" ref={this.refs.itemHeight}/>
                            </div>
                            <label className="col-xs-6 col-sm-2" htmlFor="itemCount">Item Count</label>
                            <div className="col-xs-6 col-sm-4">
                                <input onInput={this.update} className="form-control" type="number" min="0"
                                       value={this.state.itemCount} id="itemCount" ref={this.refs.itemCount}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-6 col-sm-2" htmlFor="scrollDelay">Item Buffer</label>
                            <div className="col-xs-6 col-sm-4">
                                <input onInput={this.update} className="form-control" type="number" min="0"
                                       value={this.state.itemBuffer} id="itemBuffer" ref={this.refs.itemBuffer}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12" id="container" ref={this.refs.container}
                             style={this.state.contained ? {
                                 overflow: 'auto',
                                 height: this.state.containerHeight + 'px',
                             } : {}}>
                            <MyVirtualList
                                items={this.state.items}
                                itemBuffer={this.state.itemBuffer}
                                itemHeight={this.state.itemHeight}
                            />
                        </div>
                    </div>
                </div>
            );
        };
    };
};

export default VirtualList;