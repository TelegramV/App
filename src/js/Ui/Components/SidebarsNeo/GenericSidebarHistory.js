import "./GenericSidebarHistory.scss";
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent";
import UIEvents from "../../EventBus/UIEvents";
import type {AE} from "../../../V/VRDOM/component/__component_appEventsBuilder";

export class GenericSidebarHistory extends StatelessComponent {
    history = []
    bars = new Map()

    appEvents(E: AE) {
        E.bus(UIEvents.Sidebars)
            .on("push", this.push)
            .on("pop", this.pop)
    }

    pop = () => {
        const type = this.history[this.history.length - 1]
        const bar = this.bars.get(type)
        if(bar.isStatic) return
        bar.hide()
        this.history.pop()
        this.bars.get(this.history[this.history.length - 1]).show()
    }

    push = (type) => {
        const bar = this.bars.get(type)
        this.bars.get(this.history[this.history.length - 1])?.fadeOut()
        this.history.push(type)
        bar.show()
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
