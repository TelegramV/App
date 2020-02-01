import Component from "../../../../v/vrdom/Component";

export default class TabSelectorComponent extends Component {
    constructor(props) {
        super(props);
        let items = this.props.items;
        this.fragments = [];
        for(const item of items) {
            this.fragments.push(<TabSelectorItemFragment text={item.text} click={item.click} hidden={!!item.hidden} selected={!!item.selected}/>)
        }
    }

    h() {
        return <div className="tab-selector">
            {this.fragments}
        </div>
    }
}

const TabSelectorItemFragment = ({selected = false, text, hidden = false, click}) => {
    return <div className={["item rp", selected ? "selected" : "", hidden ? "hidden" : ""]} onClick={click}><span>{text}</span></div>
}