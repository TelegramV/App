import {LeftSidebar} from "../../LeftSidebar";
import nodeIf from "../../../../../../V/VRDOM/jsx/helpers/nodeIf";
import VTagsInput, {VTag, VTagIcon} from "../../../../../Elements/Input/VTagsInput";
import DialogsStore from "../../../../../../Api/Store/DialogsStore";
import {Section} from "../../../Fragments/Section";
import IconCheckmarkButton from "../../../Fragments/IconCheckmarkButton";
import AvatarCheckmarkButton from "../../../Fragments/AvatarCheckmarkButton";
import PeersStore from "../../../../../../Api/Store/PeersStore";
import FoldersManager from "../../../../../../Api/Dialogs/FolderManager";
import UIEvents from "../../../../../EventBus/UIEvents";

export class FolderPeersSidebar extends LeftSidebar {
    state = {
        selectedChats: new Set()
    }
    content(): * {
        const f = this.state.folder || {
            include_peers: [],
            pinned_peers: [],
            exclude_peers: []
        }
        console.log("isExclude", this.state.exclude)
        let tags = null
        if(!this.state.exclude) {
            tags = [
                nodeIf(<VTagIcon icon="newprivate" text="Contacts" onRemove={l => this.toggle("contacts")}/>, f.contacts),
                nodeIf(<VTagIcon icon="noncontacts" text="Non-Contacts" onRemove={l => this.toggle("non_contacts")}/>, f.non_contacts),
                nodeIf(<VTagIcon icon="newgroup" text="Groups" onRemove={l => this.toggle("groups")}/>, f.groups),
                nodeIf(<VTagIcon icon="newchannel" text="Channels" onRemove={l => this.toggle("broadcasts")}/>, f.broadcasts),
                nodeIf(<VTagIcon icon="bots" text="Bots" onRemove={l => this.toggle("bots")}/>, f.bots),
            ]
        } else {
            tags = [
                nodeIf(<VTagIcon icon="mute" text="Muted" onRemove={l => this.toggle("exclude_muted")}/>, f.exclude_muted),
                nodeIf(<VTagIcon icon="readchats" text="Read" onRemove={l => this.toggle("exclude_read")}/>, f.exclude_read),
                nodeIf(<VTagIcon icon="archive" text="Archived" onRemove={l => this.toggle("exclude_archived")}/>, f.exclude_archived),
            ]
        }

        DialogsStore.sort().forEach(dialog => {
            const exists = this.state.selectedChats.has(dialog.peer)
            if(exists) {
                tags.push(<VTag peer={dialog.peer} onRemove={ev => {
                    this.togglePeer(dialog.peer, exists)
                }}/>)
            }
        })
        return <this.contentWrapper>
            <VTagsInput tags={tags} onInput={this.onPeerNameInput} value={this.state.filter}/>
            <Section title="Chat types">
                {!this.state.exclude ?
                    <>
                        <IconCheckmarkButton icon="newprivate" text="Contacts" checked={f.contacts}
                                             onClick={l => this.toggle("contacts")}/>
                        <IconCheckmarkButton icon="noncontacts" text="Non-Contacts" checked={f.non_contacts}
                                             onClick={l => this.toggle("non_contacts")}/>
                        <IconCheckmarkButton icon="newgroup" text="Groups" checked={f.groups}
                                             onClick={l => this.toggle("groups")}/>
                        <IconCheckmarkButton icon="newchannel" text="Channels" checked={f.broadcasts}
                                             onClick={l => this.toggle("broadcasts")}/>
                        <IconCheckmarkButton icon="bots" text="Bots" checked={f.bots}
                                             onClick={l => this.toggle("bots")}/>
                    </> :
                    <>
                        <IconCheckmarkButton icon="mute" text="Muted" checked={f.exclude_muted}
                                             onClick={l => this.toggle("exclude_muted")}/>
                        <IconCheckmarkButton icon="readchats" text="Read" checked={f.exclude_read}
                                             onClick={l => this.toggle("exclude_read")}/>
                        <IconCheckmarkButton icon="archive" text="Archived" checked={f.exclude_archived}
                                             onClick={l => this.toggle("exclude_archived")}/>
                    </>
                }
            </Section>

            <Section title="Chats">
            {
                DialogsStore.sort().map(dialog => {

                    if(!this.state.filter || dialog.peer.name.toLowerCase().includes(this.state.filter.toLowerCase())) {
                        const exists = this.state.selectedChats.has(dialog.peer)
                        return <AvatarCheckmarkButton peer={dialog.peer}
                                                      isNameAsText
                                                                   checked={exists}
                                                                   onClick={ev => {
                                                                       this.togglePeer(dialog.peer, exists)
                                                                   }}/>
                    }
                    return ""
                })
            }
            </Section>
        </this.contentWrapper>
    }

    togglePeer = (peer, exists) => {
        if(!exists) {
            this.state.selectedChats.add(peer)
        } else {
            this.state.selectedChats.delete(peer)
        }
        this.forceUpdate()
    }

    toggle = (name) => {
        this.state.folder[name] = !this.state.folder[name]
        this.forceUpdate()
    }

    get rightButtons(): *[] {
        return [
            {
                icon: "check",
                blue: true,
                onClick: _ => this.apply()
            }
        ]
    }

    apply = () => {
        console.log("apply")
        const c = []
        this.state.selectedChats.forEach(l => {
            c.push(l.inputPeer)
        })
        if(this.state.exclude) {
            this.state.folder.exclude_peers = c
        } else {
            this.state.folder.include_peers = c
        }
        delete this.state.folder.flags;
        UIEvents.General.fire("folderPeersChanged", {
            exclude: this.state.exclude,
            folder: this.state.folder
        })
        // FoldersManager.updateFolder(this.state.folder)
        UIEvents.Sidebars.fire("pop", this)
    }

    onPeerNameInput = (event) => {
        this.setState({
            filter: event.target.value
        })

    }

    onShown(params) {
        const selectedChats = new Set()
        if(params.exclude) {
            params.folder.exclude_peers.forEach(l => {
                selectedChats.add(PeersStore.getByPeerType(l))
            })
        } else {
            params.folder.include_peers.forEach(l => {
                selectedChats.add(PeersStore.getByPeerType(l))
            })
        }

        console.log("shown", params.exclude)

        this.setState({
            folder: Object.assign({}, params.folder),
            exclude: params.exclude,
            selectedChats: selectedChats
        })
    }

    get title(): string | * {
        return this.state.exclude ? "Excluded Chats" : "Included Chats"
    }
}