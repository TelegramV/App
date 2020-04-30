/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import SettingsPane from "./SettingsPane"
import {SectionFragment} from "../../Fragments/SectionFragment"
import PeersStore from "../../../../../Api/Store/PeersStore"
import MTProto from "../../../../../MTProto/External"
import SettingsFabFragment from "./SettingsFabFragment"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import PeersManager from "../../../../../Api/Peers/PeersManager"
import UIEvents from "../../../../EventBus/UIEvents"
import VLazyInput from "../../../../Elements/Input/VLazyInput"
import AppEvents from "../../../../../Api/EventBus/AppEvents"
import {askForFile} from "../../../../Utils/utils"
import {FileAPI} from "../../../../../Api/Files/FileAPI"
import EditAvatarFragment from "../../Fragments/EditAvatarFragment"
import BR20 from "../../Fragments/BR20"
import InputHint from "../../Fragments/InputHint"

class EditProfilePane extends SettingsPane {
    barName = "edit-profile";
    name = "Edit Profile";

    peer = PeersStore.self();

    saveRef = VComponent.createFragmentRef();
    loadingRef = VComponent.createFragmentRef();

    editAvatarRef = VComponent.createFragmentRef();

    nameInputRef = VComponent.createComponentRef();
    lastNameInputRef = VComponent.createComponentRef();
    bioInputRef = VComponent.createComponentRef();
    usernameInputRef = VComponent.createComponentRef();

    currentlyCheckingUsername = null;

    appEvents(E) {
        super.appEvents(E);

        E.bus(AppEvents.Peers)
            .only(event => event.peer === this.peer)
            .updateOn("updateUsername")
            .updateOn("updatePhoto")
            .updateOn("updatePhotoSmall")
    }

    init() {
        PeersStore.onSet(event => {
            if (event.peer.id === MTProto.getAuthorizedUserId()) {
                this.peer = event.peer;
                this.forceUpdate();
            }
        });
    }

    render() {
        const name = this.peer?.firstName;
        const lastName = this.peer?.lastName;
        const username = this.peer?.username;
        const photoUrl = this.peer?.photo?.smallUrl;

        return (
            <div class="sidebar sub-settings edit-page-pane scrollable">
                {this.makeHeader(true)}

                <EditAvatarFragment ref={this.editAvatarRef} onClick={this.onClickEditAvatar} srcUrl={photoUrl}/>

                <SectionFragment>
                    <VLazyInput lazyLevel={500}
                                ref={this.nameInputRef}
                                label="Name"
                                value={name}
                                onInput={this.onInputName}/>
                    <BR20/>
                    <VLazyInput ref={this.lastNameInputRef} label="Last Name" value={lastName}
                                onInput={this.onInputLastName}/>
                    <BR20/>
                    <VLazyInput ref={this.bioInputRef} label="Bio (optional)" onInput={this.onInputBio}/>
                    <BR20/>
                    <InputHint>
                        Any details such as age, occupation or city. Example: 23 y.o. designer from San Francisco.
                    </InputHint>
                </SectionFragment>

                <SectionFragment title="Username" noBorders>
                    <VLazyInput lazyLevel={300}
                                ref={this.usernameInputRef}
                                label="Username"
                                value={username}
                                onInput={this.onInputUsername}/>
                    <BR20/>
                    <InputHint>
                        You can choose a username on Telegram. If you do, other people will be able to find you by this
                        username and contact you without knowing your phone number.
                    </InputHint>
                    <BR20/>
                    <InputHint>
                        You can use a-z, 0-9 and underscores. Minimum length is 5 characters.
                    </InputHint>
                </SectionFragment>

                <SettingsFabFragment hide={true} ref={this.loadingRef} isLoading={true}/>
                <SettingsFabFragment hide={true} ref={this.saveRef} isLoading={false} onClick={this.updateUsername}/>
            </div>
        );
    }

    updateAvatar = (bytes: ArrayBuffer) => {
        this.showLoading();
        this.hideSave();

        FileAPI.uploadProfilePhoto("avatar.jpg", bytes).then(Photo => {
            this.hideLoading();

            UIEvents.General.fire("snackbar.show", {text: "Photo successfully updated!", time: 2, success: true});
        }).catch(error => {
            UIEvents.General.fire("snackbar.show", {text: error.type, time: 4, error: true});
        })
    }

    updateProfile = (field, value, error, success, ref) => {
        value = value.trim();

        if (error && value === "") {
            ref.update({
                isError: true,
                error: error
            });

            return;
        }

        ref.update({
            isError: false,
        });

        this.showLoading();
        this.hideSave();

        MTProto.invokeMethod("account.updateProfile", {
            [field]: value,
        }).then(User => {
            PeersManager.setFromRawAndFire(User);

            this.hideLoading();
            this.hideSave();

            UIEvents.General.fire("snackbar.show", {text: success, time: 2, success: true});
        }).catch(error => {
            this.hideLoading();

            ref.update({
                isError: true,
                error: error.type
            });
        });
    }

    updateUsername = () => {
        this.hideSave();

        const username = this.currentlyCheckingUsername;

        if (username === this.peer.username) {
            return;
        }

        if (username === "") {
            return;
        }

        this.showLoading();

        MTProto.invokeMethod("account.updateUsername", {
            username
        }).then(User => {
            PeersManager.setFromRawAndFire(User);

            this.hideLoading();
            this.hideSave();

            this.usernameInputRef.update({
                isError: false,
                isSuccess: false,
            });

            UIEvents.General.fire("snackbar.show", {text: "Username successfully updated!", time: 2, success: true});
        }).catch(error => {
            this.hideLoading();
            this.hideSave();

            this.usernameInputRef.update({
                isError: true,
                isSuccess: false,
                error: error.type,
            });
        });
    }

    onClickEditAvatar = (event: Event) => {
        askForFile("jpg", this.updateAvatar, true)
    }

    onInputName = (event: InputEvent) => {
        this.updateProfile("first_name", event.target.value, "Invalid name", "Name successfully updated!", this.nameInputRef);
    }

    onInputLastName = (event: InputEvent) => {
        this.updateProfile("last_name", event.target.value, null, "Last name successfully updated!", this.lastNameInputRef);
    }

    onInputBio = (event: InputEvent) => {
        this.updateProfile("about", event.target.value, null, "Bio successfully updated!", this.bioInputRef);
    }

    onInputUsername = (event: InputEvent) => {
        const username = event.target.value.trim();

        if (username === "") {
            this.usernameInputRef.update({
                isError: true,
                error: "Invalid username"
            });

            return;
        }

        this.currentlyCheckingUsername = username;

        this.showLoading();
        this.hideSave();

        this.usernameInputRef.update({
            isError: false,
            isSuccess: false,
        });

        if (username !== this.peer.username) {
            MTProto.invokeMethod("account.checkUsername", {
                username
            }).then(Bool => {
                if (username !== this.currentlyCheckingUsername) {
                    return;
                }

                this.hideLoading();
                this.showSave();

                if (Bool._ === "boolTrue") {
                    this.usernameInputRef.update({
                        isSuccess: true,
                        success: "Username is available",
                    });
                } else {
                    this.usernameInputRef.update({
                        isError: true,
                        error: "Username is already taken",
                    });
                    this.hideSave();
                }
            }).catch(error => {
                this.hideLoading();
                this.hideSave();

                this.usernameInputRef.update({
                    isError: true,
                    isSuccess: false,
                    error: error.type,
                });
            });
        } else {
            this.hideLoading();
            this.hideSave();

            this.usernameInputRef.update({
                isSuccess: false,
                isError: false,
            });
        }
    }

    showLoading = () => {
        this.loadingRef.update({
            hide: false,
        });
    }

    hideLoading = () => {
        this.loadingRef.update({
            hide: true,
        });
    }

    showSave = () => {
        this.saveRef.update({
            hide: false,
        });
    }

    hideSave = () => {
        this.saveRef.update({
            hide: true,
        });
    }
}

export default EditProfilePane;