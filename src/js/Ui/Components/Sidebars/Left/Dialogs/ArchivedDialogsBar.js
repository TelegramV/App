import LeftBarComponent from "../LeftBarComponent"
import ArchivedDialogListComponent from "./Lists/ArchivedDialogListComponent"
import type {AE} from "../../../../../V/VRDOM/component/__component_registerAppEvents";
import UIEvents from "../../../../EventBus/UIEvents";
import {BurgerAndBackComponent} from "../BurgerAndBackComponent";

export class ArchivedDialogsBar extends LeftBarComponent {

    barName = "archived"

    appEvents(E: AE) {
        super.appEvents(E)
        E.bus(UIEvents.LeftSidebar)
            .on("burger.backPressed", this.onBackPressed)
    }

    render() {
        return (
            <div className="archived settings sidebar scrollable hidden">
                <div className="settings-main">
                    <div className="sidebar-header no-borders">
                        <BurgerAndBackComponent/>
                        {/*<i className="btn-icon tgico tgico-back" onClick={_ => this.openBar("dialogs")}/>*/}
                        <div className="sidebar-title">Archived Chats</div>
                    </div>

                    <ArchivedDialogListComponent/>
                </div>
            </div>
        )
    }

    barBeforeShow = (event) => {
        console.log("onShow archive!")
        UIEvents.LeftSidebar.fire("burger.changeToBack", {
            id: this.barName
        })
    }

    onBackPressed = (event) => {
        if(event.id === this.barName) {
            this.openBar("dialogs")
            UIEvents.LeftSidebar.fire("burger.changeToBurger", {})
        }
    }
}