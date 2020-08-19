import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"

import './TabSelectorComponent.scss';

export default class TabSelectorComponent extends StatefulComponent {

    state = {
        sizes: [],
    };

    elRefs = []
    selectorRef = StatefulComponent.createRef();

    render({items, scrollable, active, showScroll}) {
        this.elRefs = []

        const wrapperClasses = {
            "tab-selector-wrapper": true,
            "scrollable-x": scrollable,
            "hide-scroll": scrollable || !showScroll
        }
        return (
            <div className={wrapperClasses}>
                <div className="tab-selector" ref={this.selectorRef}>
                    {items.map((item, i) => {
                        const ref = StatefulComponent.createFragmentRef();
                        this.elRefs.push(ref);
                        return <TabFragment text={item.text} selected={(i+1) === active} onClick={item.onClick} ref={ref}/>;
                    })}
                    <div className="underline" style={this.getUnderlineStyle()} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        if(!this.props.active) this.props.active = 1;
        this.updateSizes();
    }

    componentDidUpdate(prevProps) {
        if(!this.props.active) this.props.active = 1;
        if (prevProps && prevProps.items !== this.props.items && prevProps.active !== this.props.active) {
            this.updateSizes();
        }
    }

    setTab = (tab) => {
        this.props.active = tab;
        this.updateSizes();
    }

    updateSizes() {
        const rootBounds = this.selectorRef.$el.getBoundingClientRect();

        const sizes = [];
        for(let ref of this.elRefs) {
            const bounds = ref.$el.getBoundingClientRect();

            const left = bounds.left - rootBounds.left;
            const right = rootBounds.right - bounds.right;

            sizes.push({ left, right });
        }

        this.setState({ sizes });
        return sizes;
    }

    getUnderlineStyle() {
        if (this.props.active == null || this.state.sizes.length === 0) {
            return { left: '0', right: '100%' };
        }

        const size = this.state.sizes[Math.max(this.props.active, 1) - 1];
        if(!size) return { left: '0', right: '100%' };

        return {
            left: `${size.left}px`,
            right: `${size.right}px`,
        }
    }
}

const TabFragment = ({text, selected, onClick}) => {

    const classes = {
        tab: true,
        rp: true,
        rps: true,
        selected: selected
    }

    return (
        <div class={classes} onClick={onClick}>
            {text}
        </div>
    )
}