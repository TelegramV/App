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
import {ButtonWithIconAndCheckmarkFragment} from "../../../Fragments/ButtonWithIconAndCheckmark";
import VTagsInput, {VTag, VTagIcon} from "../../../../../Elements/Input/VTagsInput";
import {BurgerAndBackComponent} from "../../BurgerAndBackComponent";
import DialogsStore from "../../../../../../Api/Store/DialogsStore";
import {CheckboxWithPeerFragment} from "../../../Fragments/CheckboxWithPeerFragment";
import {isEquivalent} from "../../../../../../Utils/array";
import {ButtonWithPeerAndCheckmarkFragment} from "../../../Fragments/ButtonWithPeerAndCheckmarkFragment";



export default class FolderPeersPane extends SettingsPane {
    barName = "folder-peers";

    state = {
        currentFolder: null,
        filter: null,
        selectedChats: null
    }

    constructor(props) {
        super(props);

        this.name = "Included Chats"
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
        const tags = [
            nodeIf(<VTagIcon icon="newprivate" text="Contacts" onRemove={l => this.toggle("contacts")}/>, f.contacts),
            nodeIf(<VTagIcon icon="noncontacts" text="Non-Contacts" onRemove={l => this.toggle("non_contacts")}/>, f.non_contacts),
            nodeIf(<VTagIcon icon="newgroup" text="Groups" onRemove={l => this.toggle("groups")}/>, f.groups),
            nodeIf(<VTagIcon icon="newchannel" text="Channels" onRemove={l => this.toggle("broadcasts")}/>, f.broadcasts),
            nodeIf(<VTagIcon icon="bots" text="Bots" onRemove={l => this.toggle("bots")}/>, f.bots),
        ]

        DialogsStore.toSortedArray().forEach(dialog => {
            const exists = this.state.selectedChats.has(dialog.peer)
            if(exists) {
                tags.push(<VTag peer={dialog.peer} onRemove={ev => {
                    this.togglePeer(dialog.peer, exists)
                }}/>)
            }
        })

        return (
            <div class={{
                "sidebar sub-settings scrollable": true,
                "fade-in": this.barVisible
            }}>
                <div className={{"sidebar-header": true, "no-borders": true}}>
                    <BurgerAndBackComponent/>
                    <div className="sidebar-title">{this.name}</div>
                    <span className="btn-icon tgico tgico-check rp rps blue" onClick={this.apply}/>
                </div>
                <div className="peers">

                    <VTagsInput tags={tags} onInput={this.onPeerNameInput}/>
                </div>


                <SectionFragment title="Chat types">
                    <ButtonWithIconAndCheckmarkFragment icon="newprivate" name="Contacts" checked={f.contacts} onClick={l => this.toggle("contacts")}/>
                    <ButtonWithIconAndCheckmarkFragment icon="noncontacts" name="Non-Contacts" checked={f.non_contacts} onClick={l => this.toggle("non_contacts")}/>
                    <ButtonWithIconAndCheckmarkFragment icon="newgroup" name="Groups" checked={f.groups} onClick={l => this.toggle("groups")}/>
                    <ButtonWithIconAndCheckmarkFragment icon="newchannel" name="Channels" checked={f.broadcasts} onClick={l => this.toggle("broadcasts")}/>
                    <ButtonWithIconAndCheckmarkFragment icon="bots" name="Bots" checked={f.bots} onClick={l => this.toggle("bots")}/>
                </SectionFragment>

                <SectionFragment title="Chats">
                    {
                        DialogsStore.toSortedArray().map(dialog => {

                            if(!this.state.filter || dialog.peer.name.toLowerCase().includes(this.state.filter.toLowerCase())) {
                                const exists = this.state.selectedChats.has(dialog.peer)
                                return <ButtonWithPeerAndCheckmarkFragment peer={dialog.peer}
                                                                 checked={exists}
                                                                 onClick={ev => {
                                                                     this.togglePeer(dialog.peer, exists)
                                                                 }}/>
                            }
                            return ""
                        })
                    }
                </SectionFragment>

            </div>
        )
    }

    togglePeer = (peer, exists) => {
        // if(exists) {
        //     this.state.currentFolder.include_peers.splice(this.state.currentFolder.include_peers.findIndex(l => isEquivalent(peer.inputPeer, l)), 1)
        // } else {
        //     this.state.currentFolder.include_peers.push(peer.inputPeer)
        // }
        if(!exists) {
            this.state.selectedChats.add(peer)
        } else {
            this.state.selectedChats.delete(peer)
        }
        this.forceUpdate()
    }

    toggle = (name) => {
        this.state.currentFolder[name] = !this.state.currentFolder[name]
        this.forceUpdate()
    }

    onPeerNameInput = (event) => {
        this.setState({
            filter: event.target.value
        })

    }

    apply = () => {
        this.state.currentFolder.include_peers = []
        this.state.selectedChats.forEach(l => {
            this.state.currentFolder.include_peers.push(l.inputPeer)
        })
        delete this.state.currentFolder.flags;
        FoldersManager.updateFolder(this.state.currentFolder)
        this.hide()
    }

    onEditFolder = (event) => {
        console.log(event.folder)
        const m = new Set()
        event.folder.include_peers.forEach(l => {
            m.add(PeersStore.getByPeerType(l))
        })
        this.setState({
            currentFolder: event.folder,
            filter: null,
            selectedChats: m
        })
    }

    onCreateNewFolder = (event) => {

    }

}