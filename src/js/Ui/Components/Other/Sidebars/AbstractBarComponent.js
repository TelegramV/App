import VComponent from "../../../../V/VRDOM/component/VComponent"
import VUI from "../../../VUI"

export class AbstractBarComponent extends VComponent {

    barName = undefined
    barVisible = false

    sidebarOnShow = event => {
        if (event.barName === this.barName) {
            if (!this.barVisible) {
                this.barVisible = true
                this.barBeforeShow(event)
                this.barOnShow(event)
                this.barAfterShow(event)
            }
        } else if (this.barVisible) {
            this.barVisible = false
            this.barBeforeHide(event)
            this.barOnHide(event)
            this.barAfterHide(event)
        }
    }

    sidebarOnHide = event => {
        if (event.barName === this.barName) {
            this.barVisible = false
            this.barBeforeHide(event)
            this.barOnHide(event)
            this.barAfterHide(event)
        }
    }

    openBar = barName => {
    }

    hideBar = barName => {
    }

    // you can override methods below

    // show

    barBeforeShow = (event) => {
    }

    barOnShow = (event) => {
        $(this.$el).show()
    }

    barAfterShow = (event) => {
    }

    // hide

    barBeforeHide = (event) => {
    }

    barOnHide = (event) => {
        $(this.$el).hide()
    }

    barAfterHide = (event) => {
    }
}