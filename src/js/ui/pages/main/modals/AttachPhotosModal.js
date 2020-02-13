import VComponent from "../../../v/vrdom/component/VComponent";
import {ModalHeaderFragment} from "./ModalHeaderFragment";
import {InputComponent} from "../components/input/inputComponent";
import AppSelectedPeer from "../../../reactive/SelectedPeer";
import {FileAPI} from "../../../../api/fileAPI";
import {Layouter} from "../../../utils/layout";
import {ModalManager} from "../../../modalManager";

class GalleryFragment extends VComponent {
    h() {
        return <div className={["grouped", Layouter.getClass(this.props.blobs.length)]}>
            {this.props.blobs.map(l => {
                return <figure>
                    <img src={l}/>
                </figure>
            })}
        </div>
    }

    addPhoto(blob) {
        if (this.props.blobs.length >= 10) return
        this.props.blobs.push(blob)
        this.__patch()
    }

    getMedia() {
        return Promise.all(this.props.blobs.map(async l => {
            return await FileAPI.uploadPhoto(await fetch(l).then(r => r.arrayBuffer()), "lol.jpg")
        }))
    }
}

export class AttachPhotosModal extends VComponent {
    captionRef = VComponent.createComponentRef()
    galleryRef = VComponent.createComponentRef()

    h() {
        return <div>
            <ModalHeaderFragment title="Send Photos" close actionText="Send" action={this.send.bind(this)}/>
            <div className="padded">
                <GalleryFragment ref={this.galleryRef} blobs={this.props.media}/>
                <InputComponent ref={this.captionRef} label="Caption"/>
            </div>
        </div>
    }

    addPhoto(blob) {
        this.galleryRef.component.addPhoto(blob)
    }

    async send() {
        ModalManager.close()
        const media = await this.galleryRef.component.getMedia()
        AppSelectedPeer.Current.api.sendMessage({
            text: this.captionRef.component.getValue(),
            media: media
        })
    }
}