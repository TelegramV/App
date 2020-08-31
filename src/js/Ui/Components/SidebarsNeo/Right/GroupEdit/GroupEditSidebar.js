import { RightSidebar } from "../RightSidebar";
import UIEvents from "../../../../EventBus/UIEvents";
import { Section } from "../../Fragments/Section"
import Hint from "../../Fragments/Hint"
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import API from "../../../../../Api/Telegram/API"
import AvatarUploadComponent from "../../../Basic/AvatarUploadComponent"
import IconButton from "../../Fragments/IconButton"
import CheckboxButton from "../../Fragments/CheckboxButton"
import VInput from "../../../../Elements/Input/VInput"
import PeersStore from "../../../../../Api/Store/PeersStore"
import AppSelectedInfoPeer from "../../../../Reactive/SelectedInfoPeer";

export class GroupEditSidebar extends RightSidebar {

    state = {
        avatarUrl: "",
        avatarBlob: null,
        groupName: "",
        description: "",
        historyForNew: false,
        peer: null
    }

    appEvents(E) {
        super.appEvents(E);

        E.bus(AppEvents.Peers)
            .filter(event => event.peer === this.state.peer)
            .on("updatePhoto", this.serverAvatarUpdated)
            .on("updatePhotoSmall", this.serverAvatarUpdated)
    }

    content(): * {
        return <this.contentWrapper>
                <AvatarUploadComponent onAvatarUpdated={this.onAvatarUpdate} url={this.state.avatarUrl}/>
                <Section>
                    <VInput label={this.l("lng_dlg_new_group_name")} onInput={(event) => {
                        this.setState({
                            groupName: event.target.value
                        })
                    }} value={this.state.groupName} maxLength={255}/>
                    <VInput label={this.l("lng_info_about_label")} onInput={(event) => {
                        this.setState({
                            description: event.target.value
                        })
                    }} value={this.state.description} maxLength={255}/>
                    <IconButton icon="lock" text={this.l("lng_manage_peer_group_type")} description={"Public"}/>
                    <IconButton icon="permissions" text={this.l("lng_manage_peer_permissions")} description={"8/8"}/>
                    <IconButton icon="admin" text={this.l("lng_channel_admins")} description={"5"}/>
                </Section>
                <Section>
                    <IconButton icon="newgroup" text={this.l("lng_manage_peer_members")} description={"69"}/>
                    <CheckboxButton checked={this.state.historyForNew} text="Show chat history for new members" onClick={() => this.setState({
                        historyForNew: !this.state.historyForNew
                    })}/>
                </Section>
                <Section>
                    <IconButton icon="delete" red text={this.l("lng_profile_delete_group")}/>
                </Section>
        </this.contentWrapper>
    }

    onShown() {
        const current = AppSelectedInfoPeer.Current
        if(!current) return;
        this.setState({
            avatarUrl: current.photo.smallUrl,
            groupName: current.name,
            historyForNew: false, //WTF, where it's stored?
            peer: current
        })
        current.fetchFull().then(full => {
            this.setState({
                description: full.about
            })
        })
    }

    onAvatarUpdate = (blob, url) => {
        this.setState({
            avatarUrl: url,
            avatarBlob: blob
        })
    }

    serverAvatarUpdated = () => {
        if (!this.state.avatarBlob) {
            const self = PeersStore.self();
            this.setState({
                avatarUrl: self.photo.smallUrl
            })
        }
    }

    get title() {
        return this.l("lng_edit_group")
    }

    get leftButtonIcon() {
        return "back"
    }

}