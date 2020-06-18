import {GenericSidebar} from "../GenericSidebar";

export class RightSidebar extends GenericSidebar {
    get classes() {
        const c = super.classes
        c.push("right")
        return c
    }

    show(first = false, params) {
        if(first) {
            this.setState({
                reallyHidden: false,
                hidden: false,
                unhidden: false,
                fadeIn: false,
                fadeOut: false
            })
            this.onShown(params)
        } else {
            super.show(params)
        }
    }

    hide(first = false) {
        if(first) {
            this.withTimeout(_ => {
                this.setState({
                    hidden: true,
                    reallyHidden: true
                })
            }, 250)
            this.onHide();
        } else {
            super.hide()
        }
    }

    get leftButtonIcon(): string | null {
        return "close"
    }
}