import Component from "./framework/vrdom/component";

export let ContextMenuManager

export class ContextMenuComponent extends Component {
    constructor(props) {
        super(props)
        ContextMenuManager = this
        this.state = {
            hidden: true,
            data: [],
            x: 0,
            y: 0
        }
    }

    h() {
        return (
            <div className={["context-menu-wrapper", this.state.hidden ? "hidden" : ""]} onClick={this.close}>
                <div className="context-menu" css-top={this.state.y + "px"} css-left={this.state.x + "px"}>
                    {this.state.data.map(l => {
                        return <div className="element rp rps" onClick={q => this.select(l, q)}>
                            <i className={["tgico", "tgico-" + l.icon]}/>
                            <span>{l.title}</span>
                            {l.counter ?
                                <div className="badge">{l.counter}</div>
                                : ""
                            }
                        </div>
                    })}
                </div>
            </div>
        )
    }

    select(l, ev) {
        if(l.onClick) {
            l.onClick()
        }
        ev.stopPropagation()
        this.close()
    }

    close() {
        this.state.data = []
        this.state.hidden = true
        this.__patch()
    }

    open(data = []) {
        this.state.data = data
        this.state.hidden = false
        this.__patch()
    }

    openXY(data, x, y) {
        this.state.x = x
        this.state.y = y
        this.open(data)
    }

    openCenter(data = [], elem) {
        let rect = elem.getBoundingClientRect()
        this.openXY(data, rect.x + rect.width / 2, rect.y + rect.height / 2)
    }

    openBelow(data = [], elem) {
        let rect = elem.getBoundingClientRect()
        this.openXY(data, rect.x, rect.y + rect.height + 10)
    }
}
