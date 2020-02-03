import Component from "../../../../v/vrdom/Component";

export default class TabSelectorComponent extends Component {
    constructor(props) {
        super(props);
        let items = this.props.items;
        this.fragments = [];
        for(let i = 0; i<items.length; i++) {
            let item = items[i];
            if(item.selected) this.state.selected = i;
            this.fragments.push(<TabSelectorItemFragment tabIndex={i} text={item.text} click={this._itemClick.bind(this)} hidden={!!item.hidden} selected={!!item.selected}/>)
        }

    }

    h() {
        return <div className="tab-selector">
            {this.fragments}
        </div>
    }

    _itemClick(ev) {
        let el = ev.currentTarget;
        let index = el.getAttribute("tab-index");
        this.state.selected = index;
        this.removeSelected();
        this.$el.childNodes[index].classList.add("selected");
        let callback = this.props.items[index].click;
        if(callback) callback();
    }

    removeSelected() {
        for(const item of this.$el.childNodes) {
            item.classList.remove("selected");
        }
    }
}

const TabSelectorItemFragment = ({selected = false, text, hidden = false, tabIndex=-1, click}) => {
    let classes = ["item","rp"];
    if(selected) classes.push("selected")
    if(hidden) classes.push("hidden")
    return <div tab-index={tabIndex} className={classes} onClick={click}><span>{text}</span></div>
}