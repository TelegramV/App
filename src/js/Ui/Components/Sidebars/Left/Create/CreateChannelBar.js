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

import LeftBarComponent from "../LeftBarComponent"
import EditAvatarFragment from "../../Fragments/EditAvatarFragment"
import {SectionFragment} from "../../Fragments/SectionFragment"
import VInput from "../../../../Elements/Input/VInput"
import BR20 from "../../Fragments/BR20"
import SettingsFabFragment from "../Settings/SettingsFabFragment"
import InputHint from "../../Fragments/InputHint"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import MTProto from "../../../../../MTProto/External"

class CreateChannelBar extends LeftBarComponent {
    barName = "create-channel";

    loadingRef = VComponent.createFragmentRef();
    nextRef = VComponent.createFragmentRef();

    titleRef = VComponent.createFragmentRef();
    aboutRef = VComponent.createFragmentRef();

    channel = {
        title: "",
        about: ""
    }

    appEvents(E: AE) {
        super.appEvents(E)
        E.bus(UIEvents.LeftSidebar)
            .on("burger.backPressed", this.onBackPressed)
    }

    render() {
        return (
            <div className="settings sidebar scrollable hidden">
                <div className="sidebar-header no-borders">
                    {/*<i className="btn-icon tgico tgico-back rp rps" onClick={() => this.openBar("dialogs")}/>*/}
                    <div className="sidebar-title">Create Channel</div>
                </div>

                <EditAvatarFragment/>

                <SectionFragment noBorders>
                    <VInput label="Channel Name"
                            onInput={this.onInputChannelName}
                            ref={this.titleRef}/>
                    <BR20/>
                    <VInput label="Description (optional)"
                            onInput={this.onInputChannelDescription}
                            renderif={this.aboutRef}/>
                    <BR20/>
                    <InputHint>
                        You can provide an optional description of your channel.
                    </InputHint>
                </SectionFragment>

                <SettingsFabFragment hide={true}
                                     isLoading={true}
                                     ref={this.loadingRef}/>
                <SettingsFabFragment hide={true}
                                     isLoading={false}
                                     icon="next"
                                     ref={this.nextRef}
                                     onClick={this.onClickNext}/>
            </div>
        )
    }

    onBackPressed = (event) => {
        if(event.id === this.barName) {
            this.openBar("dialogs")
            UIEvents.LeftSidebar.fire("burger.changeToBurger", {})
        }
    }

    barBeforeShow = (event) => {
        UIEvents.LeftSidebar.fire("burger.changeToBack", {
            id: this.barName
        })
    }

    onInputChannelName = (event: InputEvent) => {
        const title = event.target.value.trim();

        if (title !== "") {
            this.channel.title = title;
            this.showNext()
        } else {
            this.hideNext();
        }
    }

    onInputChannelDescription = (event: InputEvent) => {
        this.channel.about = event.target.value.trim();
    }

    onClickNext = (event: Event) => {
        if (this.validateChannel()) {
            this.showLoading();

            MTProto.invokeMethod("channels.createChannel", {
                title: this.channel.title,
                about: this.channel.about,
            }).then(Updates => {
                this.hideLoading();
                MTProto.UpdatesManager.process(Updates);
                this.openBar("dialogs");
                this.reset();
            }).catch(error => {
                UIEvents.General.fire("snackbar.show", {text: error.type, time: 2, error: true});
            });
        }
    }

    validateChannel = () => {
        return true;
    }

    reset = () => {
        this.hideLoading();
        this.hideNext();
        // probably bug in vrdom
        this.titleRef.update({
            value: "",
            isError: false,
            isSuccess: false,
        });
        this.aboutRef.update({
            value: "",
            isError: false,
            isSuccess: false,
        });
    }

    showNext = () => {
        this.loadingRef.update({
            hide: true,
        });
        this.nextRef.update({
            hide: false,
        });
    }

    hideNext = () => {
        this.nextRef.update({
            hide: true,
        });
    }

    showLoading = () => {
        this.nextRef.update({
            hide: true,
        });
        this.loadingRef.update({
            hide: false,
        });
    }

    hideLoading = () => {
        this.loadingRef.update({
            hide: true,
        });
    }
}

export default CreateChannelBar;