import SettingsPane from "../SettingsPane";
import {ButtonWithIconFragment} from "../../../Fragments/ButtonWithIconFragment";
import {SectionFragment} from "../../../Fragments/SectionFragment";
import InputHint from "../../../Fragments/InputHint";
import BR20 from "../../../Fragments/BR20";
import FoldersManager from "../../../../../../Api/Dialogs/FolderManager";
import AppEvents from "../../../../../../Api/EventBus/AppEvents";


export default class FoldersPane extends SettingsPane {
    barName = "folder-settings";

    constructor(props) {
        super(props);

        this.name = "Folders"
    }

    appEvents(E) {
        super.appEvents(E);
        E.bus(AppEvents.General)
            .on("suggestedFoldersUpdate", this.onSuggestedFoldersUpdate)
    }

    render() {
        const suggested = FoldersManager.getSuggestedFolders()
        return (
            <div class="sidebar sub-settings general-settings scrollable">
                {this.makeHeader(true)}

                <SectionFragment title="My folders">
                    {FoldersManager.folders.map(l => {
                        return <ButtonWithIconFragment icon="add" name={l.title} description={"101 chats"}/>
                    })}
                    <ButtonWithIconFragment icon="add" name="Create new folder"
                                            onClick={_ => this.openPane("background-image")}/>
                    <BR20/>
                    <InputHint>
                        Create folders for different groups of chats and quickly switch between them.
                    </InputHint>
                </SectionFragment>


                {suggested.length > 0 ?
                <SectionFragment title="Recommended folders">
                    {suggested.map(l => {
                        return <ButtonWithIconFragment icon="add" name={l.filter.title} description={l.description}
                                                onClick={l => this.addRecommendedFolder(l.filter)}/>
                    })}
                </SectionFragment>
                    : ""}
            </div>
        )
    }

    addRecommendedFolder = (filter) => {

    }

    onSuggestedFoldersUpdate = (event) => {
        this.forceUpdate()
    }

}