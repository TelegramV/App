import Component from "./v/vrdom/Component";

export let ContextMenuManager

export class ContextMenuComponent extends Component {
    constructor(props) {
        super(props)

        ContextMenuManager = this

        this.state = {
            hidden: true,
            data: [],
            x: 0,
            y: 0,
            animation: "left-top"
        }
    }

    h() {
        return (
            <div className={["context-menu-wrapper", this.state.hidden ? "hidden" : ""]} onClick={this.close}
                 onContextMenu={this.close}>
                <div className={["context-menu", this.state.animation]} css-top={this.state.y + "px"}
                     css-left={this.state.x + "px"}>
                    {this.state.data.map(l => {
                        if (typeof l === "function") {
                            l = l()
                        }

                        return <div className={["element", "rp", "rps", l.red ? "red" : ""]}
                                    onClick={q => this.select(l, q)}>
                            {l.icon ?
                                <i className={["tgico", "tgico-" + (typeof(l.icon) === "function" ? l.icon() : l.icon)]}/>
                                : ""}
                            <span>{(typeof(l.title) === "function" ? l.title() : l.title)}</span>

                            {l.counter ?
                                <div className="badge">{l.counter}</div>
                                : ""
                            }
                            {l.after ?
                                <div className="after">{l.after}</div>
                                : ""}
                        </div>
                    }
                    )}
                </div>
            </div>
        )
    }

    select(l, ev) {
        if (l.onClick) {
            l.onClick()
        }
        ev.stopPropagation()
        this.close()
    }

    close() {
        this.state.hidden = true
        this.__patch()

    }

    open(data = []) {
        this.state.data = data
        this.state.hidden = false

        this.__patch()

    }

    openXY(data, x, y, origin = "left-top") {
        // TODO replace that with not hardcoded values
        const width = 220
        const height = data.length * 64
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        this.state.animation = origin
        if (x + width >= windowWidth) {
            x = x - width
            this.state.animation = "right-top"
        }
        if (y + height >= windowHeight) {
            y = y - height
            if (this.state.animation === "right-top") {
                this.state.animation = "right-bottom"
            } else {
                this.state.animation = "left-bottom"
            }
        }
        this.state.x = x
        this.state.y = y

        this.open(data)
    }

    openCenter(data = [], elem) {
        let rect = elem.getBoundingClientRect()
        this.openXY(data, rect.x + rect.width / 2, rect.y + rect.height / 2)
    }

    openBelow(data = [], elem, origin) {
        let rect = elem.getBoundingClientRect()
        let x = rect.x;
        let y = rect.y;
        if(origin && origin.includes("right")) {
            x = x - 220+ rect.width; //Макс, винеси довжину в змінну
        }
        this.openXY(data, x, y + rect.height + 10, origin)
    }


    openAbove(data = [], elem, origin) {
        let rect = elem.getBoundingClientRect()
        this.openXY(data, rect.x, rect.y - 10, origin)
    }

    listener(data = []) {
        return ev => {
            ev.preventDefault()
            ContextMenuManager.openXY(data, ev.clientX, ev.clientY)
        }
    }
}

//TODO uncomment before production
/*window.oncontextmenu = function (ev) {
    ev.preventDefault()
}*/