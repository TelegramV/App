import "./TabSelector.scss";
import StatefulComponent from "../../../../V/VRDOM/component/StatefulComponent";
import classIf from "../../../../V/VRDOM/jsx/helpers/classIf";
import VComponent from "../../../../V/VRDOM/component/VComponent";

export class TabSelector extends StatefulComponent {
    state = {
        selected: 0
    }
    content = VComponent.createRef()

    init() {
        this.state.selected = this.props.selected ?? 0
    }

    render(props, state) {
        return <div className="tab-selector">
            <div className="tabs horizontal-scroll">
                {props.tabs.map((l, index) => {
                    return <div className={["tab", classIf(state.selected === index, "selected")]} onClick={_ => this.selectTab(index)}>
                        <span>
                            {l.name}
                        </span>
                    </div>
                })}
            </div>

            {/*onScroll={this.onContentScroll}*/}
            <div className="content" ref={this.content}>
                {props.tabs.map(l => {
                    return <div className="content-wrapper" onScroll={l.onScroll}>
                        {l.content}
                    </div>
                })}
            </div>
        </div>
    }

    componentDidMount() {

    }

    onContentScroll = (event) => {
        event.preventDefault()
        const left = this.content.$el.scrollLeft
        const width = this.content.$el.clientWidth
        if(left % width === 0) {
            // TODO should use intersectobserver!
            this.selectTab(left / width)
        }
    }

    selectTab = (index) => {
        this.setState({
            selected: index
        })
        this.applyScroll()

    }

    applyScroll() {
        this.content.$el.scrollTo({
            left: (this.content.$el.clientWidth * this.state.selected),
            behavior: "smooth"
        })
    }
}