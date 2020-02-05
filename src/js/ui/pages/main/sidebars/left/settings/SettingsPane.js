import {LeftBarComponent} from "../LeftBarComponent"
import UIEvents from "../../../../../eventBus/UIEvents"

export default class SettingsPane extends LeftBarComponent {
    constructor(props) {
        super(props)

        this.name = "Settings"
        this.barVisible = false;

        this.previous = this.props.previous;
    }

    barOnShow = () => {
        this.$el.classList.remove("hidden")
        this.$el.classList.remove("fade-out")
        this.$el.classList.add("fade-in")
    }

    barOnHide = () => {
        this.$el.classList.remove("fade-in")
        this.$el.classList.add("fade-out")
        this.$el.classList.add("hidden")
    }

    barAfterHide = () => {
        this.$el.classList.remove("fade-out")
    }

    onBack = () => {
        UIEvents.LeftSidebar.fire("show", {
            barName: this.previous
        })
    }

    makeHeader = () => {
        return (
            <div class="sidebar-header">
                <i class="btn-icon tgico tgico-back" onClick={this.onBack.bind(this)}/>
                <div class="sidebar-title">{this.name}</div>
            </div>
        )
    }
}