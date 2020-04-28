import LeftBarComponent from "../LeftBarComponent"
import UIEvents from "../../../../EventBus/UIEvents"

export default class SettingsPane extends LeftBarComponent {
    constructor(props) {
        super(props)

        this.name = "Settings"
        this.barVisible = false;

        this.previous = this.props.previous;
    }

    appEvents(E) {
        super.appEvents(E);
        E.bus(UIEvents.LeftSidebar)
            .on("hideAnimation", this.hideAnimation)
    }

    sidebarOnShow = event => {
        if (event.barName === this.barName) {
            console.log("sidebarOnShow", this.name, this.barVisible, this.previous)

            if (!this.barVisible) {
                this.barVisible = true
                this.barBeforeShow(event)
                this.barOnShow(event)
                this.barAfterShow(event)
            }
        }
        /*else if (this.barVisible) {
            this.barVisible = false
            this.barBeforeHide(event)
            this.barOnHide(event)
            this.barAfterHide(event)
        }*/
    }

    sidebarOnHide = event => {
        if (event.barName === this.barName) {
            console.log("sidebarOnHide", this.name, this.barVisible, this.previous)

            this.barVisible = false
            this.barBeforeHide(event)
            this.barOnHide(event)
            this.barAfterHide(event)
        }
    }

    hideAnimation = event => {
        if (event.barName === this.barName) {
            this.$el.classList.toggle("fade-out", event.hide);

            console.log("HIDE ANIM", this.barName)
        }
    }

    barOnShow = () => {
        console.log("barOnShow", this.name, this.props)
        this.$el.classList.add("fade-in");
        if (this.props.previous === "settings") {
            this.$el.parentElement.querySelector(".settings-main").classList.add("fade-out")
        }

        UIEvents.LeftSidebar.fire("hideAnimation", {
            barName: this.previous,
            hide: true
        })
    }

    barOnHide = () => {
        console.log("barOnHide", this.name, this.props)
        this.$el.classList.remove("fade-in")
        if (this.props.previous === "settings") {
            this.$el.parentElement.querySelector(".settings-main").classList.remove("fade-out")
        }
    }

    onBack = () => {
        console.log("back", this.name, this.previous)

        UIEvents.LeftSidebar.fire("hide", {
            barName: this.barName
        })
        UIEvents.LeftSidebar.fire("hideAnimation", {
            barName: this.previous,
            hide: false
        })
        UIEvents.LeftSidebar.fire("show", {
            barName: this.previous
        })
    }

    openPane = (name) => {
        console.log("openPane", name, "this", this.name, this.previous)
        UIEvents.LeftSidebar.fire("show", {
            barName: name
        })


    }

    makeHeader = (noBorders = false) => {
        return (
            <div class={{"sidebar-header": true, "no-borders": noBorders}}>
                <i class="btn-icon tgico tgico-back rp rps" onClick={this.onBack}/>
                <div class="sidebar-title">{this.name}</div>
            </div>
        )
    }
}