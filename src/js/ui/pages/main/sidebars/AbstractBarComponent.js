import {VComponent} from "../../../v/vrdom/component/VComponent"
import {VUI} from "../../../v/VUI"

export class AbstractBarComponent extends VComponent {

    barName = undefined
    barVisible: false

    leftSidebarOnShow = event => {
        if (event.barName === this.barName) {
            if (!this.barVisible) {
                this.barVisible = true
                this.barBeforeShow(event.barName)
                this.barOnShow(event.barName)
                this.barAfterShow(event.barName)
            }
        } else if (this.barVisible) {
            this.barVisible = false
            this.barBeforeHide(event.barName)
            this.barOnHide(event.barName)
            this.barAfterHide(event.barName)
        }
    }

    // you can override methods below

    // show

    barBeforeShow = () => {
    }

    barOnShow = () => {
        VUI.showElement(this.$el)
    }

    barAfterShow = () => {
    }

    // hide

    barBeforeHide = () => {
    }

    barOnHide = () => {
        VUI.hideElement(this.$el)
    }

    barAfterHide = () => {
    }
}