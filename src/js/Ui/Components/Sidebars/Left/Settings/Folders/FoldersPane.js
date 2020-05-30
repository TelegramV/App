import SettingsPane from "../SettingsPane";
import {ButtonWithIconFragment} from "../../../Fragments/ButtonWithIconFragment";
import {SectionFragment} from "../../../Fragments/SectionFragment";
import InputHint from "../../../Fragments/InputHint";
import BR20 from "../../../Fragments/BR20";
import FoldersManager from "../../../../../../Api/Dialogs/FolderManager";
import AppEvents from "../../../../../../Api/EventBus/AppEvents";
import ButtonWithIconAndDescriptionFragment from "../../../Fragments/ButtonWithIconAndDescriptionFragment";
import filterNoChats from "../../../../../../../../public/static/animated/filter_no_chats";
import filters from "../../../../../../../../public/static/animated/filters";
import Lottie from "../../../../../Lottie/Lottie";
import VButton from "../../../../../Elements/Button/VButton";
import Center from "../../Fragments/Center";
import UIEvents from "../../../../../EventBus/UIEvents";



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
            <div class="sidebar sub-settings folders-settings scrollable">
                {this.makeHeader(true)}

                <Center>
                    <Lottie
                        width={100}
                        height={100}
                        options={{
                            animationData: filters,
                            loop: true,
                            autoplay: true,
                        }}
                        // onClick={onClick}
                        loadDelay={50}
                        playOnHover/>
                        <BR20/>
                    <InputHint center>
                        Create folders for different groups of chats and quickly switch between them.
                    </InputHint>
                    <BR20/>
                    <VButton isRound onClick={this.createFolder}><i className="tgico-add"/>Create Folder</VButton>
                </Center>

                <SectionFragment title="Folders">
                    {FoldersManager.folders.map(l => {
                        return <ButtonWithIconAndDescriptionFragment name={l.title} description={"101 chats"} onClick={_ => this.editFolder(l)}/>
                    })}
                    {/*<ButtonWithIconAndDescriptionFragment icon="add" name="Create new folder"*/}
                    {/*                        onClick={_ => this.openPane("background-image")}/>*/}
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

    editFolder = (folder) => {
        UIEvents.LeftSidebar.fire("folders.edit", {
            folder: folder
        })
        this.openPane("create-folder")
    }

    createFolder = () => {

        UIEvents.LeftSidebar.fire("folders.createNew", {
            folder: folder
        })
        this.openPane("create-folder")
    }

    addRecommendedFolder = (filter) => {

    }

    onSuggestedFoldersUpdate = (event) => {
        this.forceUpdate()
    }

}