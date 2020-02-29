import LeftBarComponent from "../LeftBarComponent"
import UIEvents from "../../../../EventBus/UIEvents"

export default class SettingsPane extends LeftBarComponent {
    constructor(props) {
        super(props)

        this.name = "Settings"
        this.barVisible = false;

        this.previous = this.props.previous;
    }

    barOnShow = () => {
        this.$el.classList.add("fade-in");
    }

    barOnHide = () => {
        this.$el.classList.remove("fade-in")
    }

    onBack = () => {
        UIEvents.LeftSidebar.fire("show", {
            barName: this.previous
        })
    }

    openPane = (name) => {
        UIEvents.LeftSidebar.fire("show", {
            barName: name
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