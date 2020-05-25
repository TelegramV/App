import {DialogsBarContextMenu} from "./Dialogs/DialogsBar";
import DialogsManager from "../../../../Api/Dialogs/DialogsManager";
import UIEvents from "../../../EventBus/UIEvents";
import type {AE} from "../../../../V/VRDOM/component/__component_registerAppEvents";
import StatefulComponent from "../../../../V/VRDOM/component/StatefulComponent"
import AppEvents from "../../../../Api/EventBus/AppEvents";
import FoldersManager from "../../../../Api/Dialogs/FolderManager";

export class BurgerAndBackComponent extends StatefulComponent {
    state = {
        back: false,
        id: null
    }

    get isMain() {
        return !!this.props.isMain
    }

    get isNoFolders() {
        return !!this.props.isNoFolders
    }

    appEvents(E: AE) {
        E.bus(UIEvents.LeftSidebar)
            .on("burger.changeToBack", this.onChangeToBack)
            .on("burger.changeToBurger", this.onChangeToBurger)
        E.bus(AppEvents.General)
            .on("foldersUpdate", this.onFoldersUpdate)
    }

    render() {
        return <i className={{
            "burger-and-back btn-icon rp rps tgico-menu": true,
            "burger": !this.state.back,
            "back": this.state.back,
            "hidden": (!this.isMain && FoldersManager.hasFolders()) || (this.isNoFolders && FoldersManager.hasFolders())
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

    onFoldersUpdate = (event) => {
        if(!this.isMain) {
            this.setHidden(event.folders.length > 0)
            return
        }
        if(this.isNoFolders) {
            this.setHidden(event.folders.length > 0)
        }
    }

    setHidden = (hidden = true) => {
        this.$el.classList.toggle("hidden", hidden)
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