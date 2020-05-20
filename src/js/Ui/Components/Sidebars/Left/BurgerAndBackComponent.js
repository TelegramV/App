import {DialogsBarContextMenu} from "./Dialogs/DialogsBar";
import DialogsManager from "../../../../Api/Dialogs/DialogsManager";
import UIEvents from "../../../EventBus/UIEvents";
import type {AE} from "../../../../V/VRDOM/component/__component_registerAppEvents";
import StatefulComponent from "../../../../V/VRDOM/component/StatefulComponent"

export class BurgerAndBackComponent extends StatefulComponent {
    state = {
        back: false,
        id: null
    }

    get isMain() {
        return !!this.props.isMain
    }

    appEvents(E: AE) {
        E.bus(UIEvents.LeftSidebar)
            .on("burger.changeToBack", this.onChangeToBack)
            .on("burger.changeToBurger", this.onChangeToBurger)
    }

    render() {
        return <i className={{
            "burger-and-back btn-icon rp rps tgico-menu": true,
            "burger": !this.state.back,
            "back": this.state.back
        }} onClick={this.onClick}/>
    }

    onClick = (event) => {
        if (this.state.back) {
            UIEvents.LeftSidebar.fire("burger.backPressed", {
                id: this.state.id
            })
        } else {
            DialogsBarContextMenu(event, DialogsManager.archivedMessagesCount)
        }
    }

    onChangeToBack = (event) => {
        this.setState({
            back: true,
            id: event.id
        })
    }

    onChangeToBurger = (event) => {
        this.setState({
            back: false,
            id: null
        })
    }
}