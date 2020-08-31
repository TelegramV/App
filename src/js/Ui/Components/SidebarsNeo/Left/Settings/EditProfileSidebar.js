import { LeftSidebar } from "../LeftSidebar";
import { Section } from "../../Fragments/Section";
import Hint from "../../Fragments/Hint"
import {VInputValidate} from "../../../../Elements/Input/VInput";
import VInput from "../../../../Elements/Input/VInput";
import UIEvents from "../../../../EventBus/UIEvents";
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import AvatarUploadComponent from "../../../Basic/AvatarUploadComponent"
import PeersStore from "../../../../../Api/Store/PeersStore"
import AppEvents from "../../../../../Api/EventBus/AppEvents";
import API from "../../../../../Api/Telegram/API"
import {FileAPI} from "../../../../../Api/Files/FileAPI"

export class EditProfileSidebar extends LeftSidebar {

    state = {
        avatarUrl: "",
        avatarBlob: null,

        name: "",
        lastName: "",
        bio: "",
        username: ""
    }

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .filter(event => event.peer === PeersStore.self())
            .on("updatePhoto", this.serverAvatarUpdated)
            .on("updatePhotoSmall", this.serverAvatarUpdated)
    }

    content(): * {
        return <this.contentWrapper>
            <AvatarUploadComponent onAvatarUpdated={this.onAvatarUpdate} url={this.state.avatarUrl}/>
            <div class="edit-profile">
                <Section>
                    <VInput label={this.l("lng_settings_name_label")} onInput={(event) => {
                        this.setState({
                            name: event.target.value
                        })
                    }} value={this.state.name} maxLength={64}/>

                    <VInput label={this.l("lng_signup_lastname")} onInput={(event) => {
                        this.setState({
                            lastName: event.target.value
                        })
                    }} value={this.state.lastName} maxLength={64}/>

                    <VInput label={this.l("lng_bio_placeholder")} onInput={(event) => {
                        this.setState({
                            bio: event.target.value
                        })
                    }} value={this.state.bio} maxLength={70}/>
                    <Hint>{this.l("lng_settings_about_bio")}</Hint>
                </Section>
                {/*TODO lazy input username and check availability on fly*/}
                <Section title={this.l("lng_username_title")}>
                    <VInputValidate label={this.l("lng_settings_username_label")} onInput={(event) => {
                        this.setState({
                            username: event.target.value
                        })
                    }} value={this.state.username} filter={value => value.match(/^[a-z0-9_]+$/i)}/>
                    <Hint>{this.l("lng_username_about")}</Hint>
                </Section>
            </div>
        </this.contentWrapper>
    }

    onShown() {
        const self = PeersStore.self();
        this.setState({
            name: self.firstName,
            lastName: self.lastName,
            username: self.username,
            avatarUrl: self.photo.smallUrl,
            avatarBlob: null
        })
        self.fetchFull().then(full => {
            this.setState({
                bio: full.about || ""
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

    onFloatingActionButtonPressed = (event) => {
        if (this.state.name.length === 0) {
            UIEvents.fire("snackbar.show", { text: "First name can't be empty!", time: 5 })
            return;
        }
        if (this.state.username.length < 5) {
            UIEvents.fire("snackbar.show", { text: "Username must be between 5 to 32 chatacters long", time: 5 })
            return;
        }
        API.account.checkUsername(this.state.username).then(empty => {
            if (!empty && PeersStore.self()?.username !== this.state.username) {
                UIEvents.fire("snackbar.show", { text: "Username already taken", time: 5 })
                return;
            }
            UIEvents.Sidebars.fire("pop", this)
            API.account.updateProfile(this.state.name, this.state.lastName, this.state.bio);
            if (this.state.avatarBlob) {
                this.state.avatarBlob.arrayBuffer().then(buffer => {
                    return FileAPI.uploadFile(buffer)
                }).then(file => {
                    API.account.uploadProfilePhoto(file)
                })
            }
        })
    }

    get isFloatingActionButtonOnHover() {
        return true
    }

    get floatingActionButtonIcon() {
        return "check"
    }

    get isFloatingActionButtonFixed() {
        return true
    }

    get title(): string | * {
        return this.l("lng_settings_information");
    }
}