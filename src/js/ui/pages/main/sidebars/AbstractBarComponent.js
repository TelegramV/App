import {VComponent} from "../../../v/vrdom/component/VComponent"
import {VUI} from "../../../v/VUI"

export class AbstractBarComponent extends VComponent {

    barName = undefined
    barVisible: false

    leftSidebarOnShow = event => {
        if (event.barName === this.barName) {
            if (!this.barVisible) {
                this.barVisible = true
                this.barBeforeShow()
                this.barOnShow()
                this.barAfterShow()
            }
        } else if (this.barVisible) {
            this.barVisible = false
            this.barBeforeHide()
            this.barOnHide()
            this.barAfterHide()
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