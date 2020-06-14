import {GenericSidebarHistory} from "../GenericSidebarHistory";
import {SearchSidebar} from "./Search/SearchSidebar";
import {DialogInfoSidebar} from "./DialogInfo/DialogInfoSidebar";

export class RightSidebars extends GenericSidebarHistory {
    render() {
        return (
            <div className="sidebar-wrapper right hidden">
                <SearchSidebar/>
                <DialogInfoSidebar/>
            </div>
        )
    }

    push(type) {
        let params = []
        if(typeof(type) === "object") {
            type = type.type
            params = type
        }
        const bar = this.bars.get(type)


        if(!bar) return
        if(this.history.includes(type)) {
            const indexOf = this.history.indexOf(type)
            if(indexOf === this.history.length - 1) {
                // TODO hack
                bar.update && bar.update()
                bar.forceUpdate()
                return
            } else {
                for(let i = indexOf; i < this.history.length - 1; i++) {
                    this.pop()
                }
                return
            }
        }
        this.bars.get(this.history[this.history.length - 1])?.fadeOut()
        this.history.push(type)
        bar.show(this.history.length === 1, params)
        if(this.history.length === 1) {
            this.show()
        }
    }

    pop() {
        const type = this.history[this.history.length - 1]
        const bar = this.bars.get(type)

        if(!bar) return
        if(bar.isStatic) return

        this.history.pop()
        bar.hide(this.history.length === 0)

        const last = this.bars.get(this.history[this.history.length - 1])

        if(this.history.length === 0) {
            this.hide()
        }
        if(!last) return
        last.show()
    }

    hide() {
        this.$el.classList.toggle("hidden", true)
    }

    show() {
        this.$el.classList.toggle("hidden", false)
    }
}