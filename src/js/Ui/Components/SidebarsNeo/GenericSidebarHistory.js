import "./GenericSidebarHistory.scss";
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent";
import UIEvents from "../../EventBus/UIEvents";
import type {AE} from "../../../V/VRDOM/component/__component_appEventsBuilder";

export class GenericSidebarHistory extends StatelessComponent {
    history = []
    bars = new Map()

    appEvents(E: AE) {
        E.bus(UIEvents.Sidebars)
            .on("push", (e) => this.push(e))
            .on("pop", (e) => this.pop(e))
    }

    pop(from) {
        const type = this.history[this.history.length - 1]
        if(type === from || type === from.constructor) {
            const bar = this.bars.get(type)

            if (!bar) return
            if (bar.isStatic) return

            bar.hide()
            this.history.pop()

            const last = this.bars.get(this.history[this.history.length - 1])
            if (!last) return
            last.show()
        }
    }

    push(type) {
        let params = []
        if(typeof(type) === "object") {
            const t = type.sidebar
            params = Object.assign([], type)
            type = t
        }
        const bar = this.bars.get(type)

        if(!bar) return
        this.bars.get(this.history[this.history.length - 1])?.fadeOut()
        this.history.push(type)
        bar.show(params)
    }

    componentDidMount() {
        [...this.$el.childNodes].map(l => l.__v.component).forEach(l => {
            this.bars.set(l.constructor, l)
            if(l.isStatic) {
                this.push(l.constructor)
            }
        })
    }
}
