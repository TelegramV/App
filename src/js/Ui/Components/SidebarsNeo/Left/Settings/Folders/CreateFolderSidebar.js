import {LeftSidebar} from "../../LeftSidebar";
import Lottie from "../../../../../Lottie/Lottie";
import filtersNew from "../../../../../../../../public/static/animated/filter_new";
import BR20 from "../../../../Sidebars/Fragments/BR20";
import InputHint from "../../../../Sidebars/Fragments/InputHint";
import Center from "../../../../Sidebars/Left/Fragments/Center";
import Animated from "../../../Fragments/Animated";
import Subheader from "../../../Fragments/Subheader";
import VInput from "../../../../../Elements/Input/VInput";
import {Section} from "../../../Fragments/Section";
import IconButton from "../../../Fragments/IconButton";
import nodeIf from "../../../../../../V/VRDOM/jsx/helpers/nodeIf";
import {ButtonWithIconFragment} from "../../../../Sidebars/Fragments/ButtonWithIconFragment";
import {SectionFragment} from "../../../../Sidebars/Fragments/SectionFragment";
import PeersStore from "../../../../../../Api/Store/PeersStore";
import {ButtonWithAvatarFragment} from "../../../../Sidebars/Fragments/ButtonWithAvatarFragment";
import AvatarButton from "../../../Fragments/AvatarButton";
import FoldersManager from "../../../../../../Api/Dialogs/FolderManager";
import VUI from "../../../../../VUI";
import UIEvents from "../../../../../EventBus/UIEvents";
import {ArchivedSidebar} from "../../Dialogs/ArchivedSidebar";
import VApp from "../../../../../../V/vapp";
import {SettingsSidebar} from "../SettingsSidebar";
import FolderPeersPane from "../../../../Sidebars/Left/Settings/Folders/FolderPeersPane";
import {FolderPeersSidebar} from "./FolderPeersSidebar";
import {Manager} from "../../../../../../Api/Manager";

export class CreateFolderSidebar extends LeftSidebar {
    content(): * {
        const f = this.state.currentFolder || {
            include_peers: [],
            pinned_peers: [],
            exclude_peers: []
        }

        return <this.contentWrapper>
            <Animated animationData={filtersNew} hidden={this.state.reallyHidden}/>
            <Subheader>
                Choose chats and type of chats that will appear and never appear in this folder.
            </Subheader>

            <Section>
                <VInput label="Folder Name" value={f.title || ""} onInput={this.onChangeTitle}/>
            </Section>


            <Section title="Included chats">
                <IconButton icon="add" text="Add Chats" blue onClick={this.includeChats}/>
                {nodeIf(<IconButton icon="newprivate" text="Contacts"/>, f.contacts)}
                {nodeIf(<IconButton icon="noncontacts" text="Non-Contacts"/>, f.non_contacts)}
                {nodeIf(<IconButton icon="newgroup" text="Groups"/>, f.groups)}
                {nodeIf(<IconButton icon="newchannel" text="Channels"/>, f.broadcasts)}
                {nodeIf(<IconButton icon="bots" text="Bots"/>, f.bots)}

                {f.pinned_peers.map(inputPeer => {
                    const peer = PeersStore.getByPeerType(inputPeer)
                    return <AvatarButton peer={peer} isNameAsText/>
                })}

                {f.include_peers.map(inputPeer => {
                    const peer = PeersStore.getByPeerType(inputPeer)
                    return <AvatarButton peer={peer} isNameAsText/>
                })}
            </Section>

            <Section title="Excluded chats">
                <IconButton icon="minus" text="Remove Chats" blue onClick={this.excludeChats}/>
                {nodeIf(<IconButton icon="mute" text="Muted"/>, f.exclude_muted)}
                {nodeIf(<IconButton icon="readchats" text="Read"/>, f.exclude_read)}
                {nodeIf(<IconButton icon="archive" text="Archived"/>, f.exclude_archived)}

                {f.exclude_peers.map(inputPeer => {
                    const peer = PeersStore.getByPeerType(inputPeer)
                    return <AvatarButton peer={peer} isNameAsText/>
                })}
            </Section>
        </this.contentWrapper>
    }

    onChangeTitle = (event) => {
        this.state.currentFolder.title = event.target.value
        delete this.state.currentFolder.flags;
        FoldersManager.updateFolder(this.state.currentFolder)
    }

    includeChats = () => {
        UIEvents.Sidebars.fire("push", {
            sidebar: FolderPeersSidebar,
            exclude: false,
            folder: this.state.currentFolder
        })
    }

    excludeChats = () => {
        UIEvents.Sidebars.fire("push", {
            sidebar: FolderPeersSidebar,
            exclude: true,
            folder: this.state.currentFolder
        })
    }


    get rightButtons(): *[] {
        return [
            {
                icon: "more",
                onClick: event => VUI.ContextMenu.openBelow([
                    {
                        icon: "delete",
                        title: "Delete Folder",
                        red: true,
                        onClick: this.deleteFolder
                    }
                ], event.target)
            }
        ]
    }

    deleteFolder = () => {
        FoldersManager.deleteFolder(this.state.currentFolder.id)
    }

    get headerBorder(): boolean {
        return false
    }

    onShown(params) {
        this.setState({
            currentFolder: FoldersManager.getFolder(params.folderId)
        })
    }

    get title(): string | * {
        return this.state.currentFolder == null ? "New Folder" : "Edit Folder"
    }
}