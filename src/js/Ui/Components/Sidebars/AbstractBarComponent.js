import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"

export class AbstractBarComponent extends StatefulComponent {

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