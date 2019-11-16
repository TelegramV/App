import {FrameworkComponent} from "../../../framework/component"
import {TelegramDialogComponent} from "./dialog"
import DialogsManager from "../../../../api/dialogs/dialogsManager"

export class DialogListComponent extends FrameworkComponent {
    constructor(props = {}) {
        super();
        this.activationFuctions = []
        DialogsManager.fetchDialogs({})
    }

    h() {
        if (DialogsManager.isFetching()) {
            return <div className="full-size-loader">
                <progress className="progress-circular big"/>
            </div>
        }

        const dialogs = DialogsManager.getDialogs()

        return (
            <div>
                <div class="list pinned">
                    {
                        dialogs.pinnedDialogs.map(dialog => {
                            return <TelegramDialogComponent constructor={{
                                dialog: dialog,
                                activationFunctions: this.activationFunctions
                            }}/>
                        })
                    }
                </div>
                <div class="list">
                    {
                        dialogs.dialogs.map(dialog => {
                            return <TelegramDialogComponent constructor={{
                                dialog: dialog,
                            }}/>
                        })
                    }
                </div>
            </div>
        )
    }

    mounted() {
        DialogsManager.listenUpdates(event => {
            this.render()
        })
    }

    updated() {
        // console.log("updated")
    }
}
