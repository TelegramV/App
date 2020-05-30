import SettingsPane from "../SettingsPane";
import {ButtonWithIconFragment} from "../../../Fragments/ButtonWithIconFragment";
import {SectionFragment} from "../../../Fragments/SectionFragment";
import InputHint from "../../../Fragments/InputHint";
import BR20 from "../../../Fragments/BR20";
import FoldersManager from "../../../../../../Api/Dialogs/FolderManager";
import AppEvents from "../../../../../../Api/EventBus/AppEvents";
import ButtonWithIconAndDescriptionFragment from "../../../Fragments/ButtonWithIconAndDescriptionFragment";
import filtersNew from "../../../../../../../../public/static/animated/filter_new";
import Lottie from "../../../../../Lottie/Lottie";
import VButton from "../../../../../Elements/Button/VButton";
import Center from "../../Fragments/Center";
import VInput from "../../../../../Elements/Input/VInput";
import AvatarComponent from "../../../../Basic/AvatarComponent";
import PeersStore from "../../../../../../Api/Store/PeersStore";
import UIEvents from "../../../../../EventBus/UIEvents";
import nodeIf from "../../../../../../V/VRDOM/jsx/helpers/nodeIf";
import {ButtonWithAvatarFragment} from "../../../Fragments/ButtonWithAvatarFragment";
import VComponent from "../../../../../../V/VRDOM/component/VComponent";



export default class CreateFolderPane extends SettingsPane {
    barName = "create-folder";

    state = {
        currentFolder: null
    }

    constructor(props) {
        super(props);

        this.name = "New Folder"
    }

    appEvents(E) {
        super.appEvents(E);

        E.bus(UIEvents.LeftSidebar)
            .on("folders.createNew", this.onCreateNewFolder)
            .on("folders.edit", this.onEditFolder)
    }

    render() {
        const f = this.state.currentFolder || {
            include_peers: [],
            pinned_peers: [],
            exclude_peers: []
        }
        this.name = this.state.currentFolder == null ? "New Folder" : "Edit Folder"
        console.log(f)

        return (
            <div class="sidebar sub-settings scrollable">
                {this.makeHeader(true)}

                <Center>
                    <Lottie
                        width={100}
                        height={100}
                        options={{
                            animationData: filtersNew,
                            loop: true,
                            autoplay: true,
                        }}
                        // onClick={onClick}
                        loadDelay={50}
                        playOnHover/>
                    <BR20/>
                    <InputHint center>
                        Choose chats and type of chats that will appear and never appear in this folder.
                    </InputHint>
                </Center>
                <BR20/>
                <VInput label="Folder Name" value={f.title || ""}/>


                <SectionFragment title="Included chats">
                    <ButtonWithIconFragment small icon="add" name="Add Chats" blue onClick={this.includeChats}/>
                    {nodeIf(<ButtonWithIconFragment small icon="newprivate" name="Contacts"/>, f.contacts)}
                    {nodeIf(<ButtonWithIconFragment small icon="noncontacts" name="Non-Contacts"/>, f.non_contacts)}
                    {nodeIf(<ButtonWithIconFragment small icon="newgroup" name="Groups"/>, f.groups)}
                    {nodeIf(<ButtonWithIconFragment small icon="newchannel" name="Channels"/>, f.broadcasts)}
                    {nodeIf(<ButtonWithIconFragment small icon="bots" name="Bots"/>, f.bots)}

                    {f.pinned_peers.map(inputPeer => {
                        const peer = PeersStore.getByPeerType(inputPeer)
                        return <ButtonWithAvatarFragment small name={peer.name} peer={peer}/>
                    })}

                    {f.include_peers.map(inputPeer => {
                        const peer = PeersStore.getByPeerType(inputPeer)
                        return <ButtonWithAvatarFragment small name={peer.name} peer={peer}/>
                    })}
                </SectionFragment>



                <SectionFragment title="Excluded chats">
                    <ButtonWithIconFragment small icon="minus" name="Remove Chats" blue onClick={this.excludeChats}/>
                    {nodeIf(<ButtonWithIconFragment small icon="mute" name="Muted"/>, f.exclude_muted)}
                    {nodeIf(<ButtonWithIconFragment small icon="readchats" name="Read"/>, f.exclude_read)}
                    {nodeIf(<ButtonWithIconFragment small icon="archive" name="Archived"/>, f.exclude_archived)}

                    {f.exclude_peers.map(inputPeer => {
                        const peer = PeersStore.getByPeerType(inputPeer)
                        return <ButtonWithAvatarFragment small name={peer.name} peer={peer}/>
                    })}
                </SectionFragment>
            </div>
        )
    }

    includeChats = () => {
        this.openPane("folder-peers")
    }

    excludeChats = () => {
        this.openPane("folder-peers")
    }

    onEditFolder = (event) => {
        console.log(event.folder)
        this.setState({
            currentFolder: event.folder
        })
    }

    onCreateNewFolder = (event) => {

    }

}