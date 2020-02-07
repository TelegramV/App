import PaneComponent from "./common/PaneComponent"
import InfoComponent from "./common/infoComponent"
import {InputComponent} from "../../main/components/input/inputComponent";
import {ButtonWithProgressBarComponent} from "../../main/components/input/buttonComponent";

import {askForFile} from "../../../utils"
import {MTProto} from "../../../../mtproto/external"
import {ModalManager} from "../../../modalManager";
import {FileAPI} from "../../../../api/fileAPI"

const Croppie = require("croppie")
export default class RegisterPaneComponent extends PaneComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    h() {
        let classList = ["fading-block", "registerPane"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        } else {
            classList.push("hidden");
        }

        return <div className={classList.join(" ")}>
            <div id="picture" className="object picture rp rps" onClick={this.addPicture}>
                <div className="tint hidden"/>
                <i className="add-icon tgico tgico-cameraadd"/></div>
            <InfoComponent header="Your name" description="Enter your name and add a profile picture"/>

            <InputComponent label="Name" type="text" ref="firstNameInput"/>
            <InputComponent label="Last Name (Optional)" type="text" ref="lastNameInput"/>

            <ButtonWithProgressBarComponent label="Start Messaging" click={this.handleSignUp} ref="nextSignUp"/>

        </div>
    }

    initCropper() {
        this.state.cropper = new Croppie(document.querySelector("#cropper"), {
            enableExif: true,
            showZoomer: false,
            viewport: {
                width: 310,
                height: 310,
                type: 'circle'
            },
            boundary: {
                width: 350,
                height: 350
            }
        });
    }

    addPictureConfirm() {
        this.state.cropper.result({
            type: 'base64'
        }).then(function (base) {
            const bytes = Uint8Array.from(atob(base.split(",")[1]), c => c.charCodeAt(0))
            console.log(bytes, base)
            this.state.pictureBlob = bytes;
            let blob = new Blob([bytes], {type: "image/png"});
            console.log(blob)
            const url = URL.createObjectURL(blob);
            const picture = this.$el.querySelector("#picture");
            picture.style.backgroundImage = 'url("' + url + '")';
            picture.querySelector(".tint").classList.remove("hidden");

            ModalManager.close()
        }.bind(this));
    }

    addPicture() {
        askForFile("image/*", function (file) {
            ModalManager.open("Drag to Reposition",
                <div id="cropperModal" className="body">
                    <div id="cropper">
                    </div>
                    <div className="done-button rp" onClick={this.addPictureConfirm}><i className="tgico tgico-check"/></div>
                </div>)
            this.initCropper()

            this.state.cropper.bind({
                url: file
            });

        }.bind(this))
    }

    setData(ev) {
        this.state.phone = ev.phone
        this.state.phoneCodeHash = ev.phoneCodeHash
    }

    handleSignUp() {
        if (this.state.isLoading) return
        this.state.isLoading = true

        const firstNameInput = this.refs.get("firstNameInput")
        const lastNameInput = this.refs.get("lastNameInput")
        const next = this.refs.get("nextSignUp")
        const firstName = firstNameInput.getValue()
        const lastName = lastNameInput.getValue()

        next.isLoading = true
        next.label = "Please wait..."

        MTProto.Auth.signUp(this.state.phone, this.state.phoneCodeHash, firstName, lastName).then(async authorization => {
            if (authorization._ === "auth.authorization") {
                if (this.state.pictureBlob) {
                    FileAPI.uploadProfilePhoto("avatar.jpg", this.state.pictureBlob).then(l => {
                        console.log("WOW finished", l)
                        this.props.finished(authorization)
                    }, error => {
                        console.log(error)
                        VF.router.push("/")
                    });
                } else {
                    this.props.finished(authorization)
                }
            } else {
                console.log(authorization)
            }
        }, error => {
            if (error.type === "FIRSTNAME_INVALID") {
                firstNameInput.error = "Invalid first name"
            } else if (error.type === "LASTNAME_INVALID") {
                lastNameInput.error = "Invalid last name"
            } else {
                firstNameInput.error = error.type
            }
            console.log(error)
        }).finally(l => {
            this.state.isLoading = false
            next.isLoading = false
            next.label = "Start Messaging"
        })
    }
}