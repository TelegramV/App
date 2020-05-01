import LeftBarComponent from "../LeftBarComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import WallpaperManager from "../../../../Managers/WallpaperManager"

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
            .on("burger.backPressed", this.onBack)

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
        this.barWillOpen()
        UIEvents.LeftSidebar.fire("burger.changeToBack", {
            id: this.barName
        })
        this.$el.classList.add("fade-in");
        if (this.props.previous === "settings") {
            this.$el.parentElement.querySelector(".settings-main").classList.add("fade-out")
        }

        UIEvents.LeftSidebar.fire("hideAnimation", {
            barName: this.previous,
            hide: true
        })
    }

    barWillOpen() {
    }

    barOnHide = () => {
        this.$el.classList.remove("fade-in")
        if (this.props.previous === "settings") {
            this.$el.parentElement.querySelector(".settings-main").classList.remove("fade-out")
        }
    }

    onBack = (event) => {
        if(event.id === this.barName) {

            UIEvents.LeftSidebar.fire("burger.changeToBack", {
                id: this.previous
            })

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
    }

    openPane = (name) => {
        // UIEvents.LeftSidebar.fire("burger.changeToBack", {
        //     id: name
        // })
        console.log("openPane", name, "this", this.barName)
        UIEvents.LeftSidebar.fire("show", {
            barName: name
        })

    }

    makeHeader = (noBorders = false) => {
        return (
            <div class={{"sidebar-header": true, "no-borders": noBorders}}>
                {/*<i class="btn-icon tgico tgico-back rp rps hidden" onClick={this.onBack}/>*/}
                <div class="sidebar-title">{this.name}</div>
            </div>
        )
    }
}