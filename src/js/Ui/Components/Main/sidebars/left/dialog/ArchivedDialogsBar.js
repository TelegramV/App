import {LeftBarComponent} from "../LeftBarComponent"
import ArchivedDialogListComponent from "./Lists/ArchivedDialogListComponent"

export class ArchivedDialogsBar extends LeftBarComponent {

    barName = "archived"

    render() {
        return (
            <div className="settings sidebar scrollable hidden">
                <div className="settings-main">
                    <div className="sidebar-header">
                        <i className="btn-icon tgico tgico-back" onClick={_ => this.openBar("dialogs")}/>
                        <div className="sidebar-title">Archived Chats</div>
                    </div>

                    <ArchivedDialogListComponent/>
                </div>
            </div>
        )
    }
}