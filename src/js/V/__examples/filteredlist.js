import XVComponent from "../X/Component/XVComponent"

export class SearchList extends XVComponent {
    // State only needs to hold the current filter text value:
    state = {
        filterText: ""
    };

    handleChange = event => {
        this.setState({filterText: event.target.value});
    };

    render() {
        // The render method on this PureComponent is called only if
        // props.list or state.filterText has changed.
        // const filteredList = this.props.list.filter(
        //     item =>
        // )

        return (
            <div>
                <input onInput={this.handleChange} value={this.state.filterText}/>
                <ul id="s">{this.props.list.map(item => <li css-display={item.includes(this.state.filterText) ? undefined : "none"} key={item}>{item}</li>)}</ul>
            </div>
        );
    }
}
