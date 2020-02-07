import {VComponent} from "../../../v/vrdom/component/VComponent"
import {VUI} from "../../../v/VUI"

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

    openBar = barName => {
    }

    // you can override methods below

    // show

    barBeforeShow = (event) => {
    }

    barOnShow = (event) => {
        VUI.showElement(this.$el)
    }

    barAfterShow = (event) => {
    }

    // hide

    barBeforeHide = (event) => {
    }

    barOnHide = (event) => {
        VUI.hideElement(this.$el)
    }

    barAfterHide = (event) => {
    }
}