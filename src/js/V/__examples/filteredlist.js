import VComponent from "../VRDOM/component/VComponent"

export class SearchList extends VComponent {
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
        const filteredList = this.props.list.filter(
            item => item.includes(this.state.filterText)
        )

        return (
            <div class="scrollable">
                <input onInput={this.handleChange} value={this.state.filterText}/>
                <ul class="scrollable" id="s">{filteredList.map(item => <li
                    key={item}>{item}</li>)}</ul>
            </div>
        );
    }
}
