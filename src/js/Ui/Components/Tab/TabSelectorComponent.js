import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import UIEvents from "../../EventBus/UIEvents"

import './TabSelectorComponent.scss';

export default class TabSelectorComponent extends StatefulComponent {

    state = {
        sizes: [],
    };

    elRefs = []
    underlineStyle = { left: '0', right: '100%' }
    selectorRef = StatefulComponent.createRef();

    appEvents(E) {
        E.bus(UIEvents.General)
            .updateOn("window.resize")
    }

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
                        return <TabFragment text={item.text} 
                                            selected={(i+1) === active} 
                                            onClick={item.onClick} 
                                            onContextMenu={item.onContextMenu} 
                                            ref={ref}/>;
                    })}
                    <div className="underline" style={this.underlineStyle} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.updateUnderline();
    }

    componentDidUpdate() {
        this.updateUnderline();
    }

    setTab = (tab) => {
        this.props.active = tab;
        this.updateUnderline();
    }

    updateUnderline = () => {
        if(!this.props.active) {
            this.underlineStyle = { left: '0', right: '100%' };
            return;
        }
        const rootBounds = this.selectorRef.$el.getBoundingClientRect();
        let ref = this.elRefs[this.props.active-1];
        if(!ref) {
            this.underlineStyle = { left: '0', right: '100%' };
            return;
        }

        const bounds = ref.$el.getBoundingClientRect();

        const left = bounds.left - rootBounds.left;
        const right = rootBounds.right - bounds.right;

        let newUnderlineStyle = {
            left: `${left}px`,
            right: `${right}px`,
        }

        if(newUnderlineStyle.left !== this.underlineStyle.left ||
            newUnderlineStyle.right !== this.underlineStyle.right) {
            this.underlineStyle = newUnderlineStyle;
            this.forceUpdate();
        }
    }
}

const TabFragment = ({text, selected, onClick, onContextMenu}) => {

    const classes = {
        tab: true,
        rp: true,
        rps: true,
        selected: selected
    }

    return (
        <div class={classes} onClick={onClick} onContextMenu={onContextMenu}>
            {text}
        </div>
    )
}