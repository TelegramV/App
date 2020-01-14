import ReactiveSelectedDialog from "../../../../reactive/SelectedDialog"

const BubblesInnerComponent = {
    name: "BubblesInnerComponent",

    state: {
        dialog: ReactiveSelectedDialog.FireOnly,
        renderedMessageElements: []
    },

    h() {
        return (
            <div id="bubbles-inner">

            </div>
        )
    },

    changed(key, value) {
        if (key === "dialog") {
            if (value) {
                console.log("wow")
            } else {
                this._clearBubbles()
            }
        }
    },

    _clearBubbles() {
        this.state.renderedMessageElements = []

        while (this.elements.$bubblesInner.firstChild) {
            this.elements.$bubblesInner.firstChild.remove()
        }
    },
}

export default BubblesInnerComponent