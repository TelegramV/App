import Component from "./framework/vrdom/component";

export let ContextMenuManager

export class ContextMenuComponent extends Component {
    constructor(props) {
        super(props)
        ContextMenuManager = this
        this.state = {
            hidden: true,
            data: []
        }
    }

    h() {
        return (
            <div className={["context-menu", this.state.hidden ? "hidden" : ""]}>
                {this.state.data.map(l => {
                    return <div className="element rp rps">
                        <i className={["tgico", "tgico-" + l.icon]}/>
                        <span>{l.title}</span>
                    </div>
                })}
            </div>
        )
    }

    open(data = []) {
        console.log("open context menu", data)
        this.state.data = data
        this.state.hidden = false
        this.__patch()
    }
}
