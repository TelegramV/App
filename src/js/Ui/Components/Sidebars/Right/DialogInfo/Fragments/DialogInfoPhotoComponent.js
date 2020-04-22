import {FileAPI} from "../../../../../../Api/Files/FileAPI"
import {ObjectWithThumbnailComponent} from "../../../../Basic/objectWithThumbnailComponent"
import GeneralMessageComponent from "../../../../Columns/Chat/Message/Common/GeneralMessageComponent";
import {PhotoMessage} from "../../../../../../Api/Messages/Objects/PhotoMessage";
import VComponent from "../../../../../../V/VRDOM/component/VComponent";
import AppEvents from "../../../../../../Api/EventBus/AppEvents";
import FileManager from "../../../../../../Api/Files/FileManager";
import TextWrapperComponent from "../../../../Columns/Chat/Message/Common/TextWrapperComponent";
import MessageWrapperFragment from "../../../../Columns/Chat/Message/Common/MessageWrapperFragment";
import MessageTimeComponent from "../../../../Columns/Chat/Message/Common/MessageTimeComponent";
import UIEvents from "../../../../../EventBus/UIEvents";
import {LoadingFragment, PhotoFigureFragment} from "../../../../Columns/Chat/Message/Photo/PhotoFigureFragment";
import {PhotoFragment} from "../../../../Columns/Chat/Message/Photo/PhotoFragment";


// макс перепиши цю діч(
// гатова! - @undrfined


export class DialogInfoPhotoComponent extends VComponent {

    init() {
        super.init();
        if(!this.props.message.loaded && !this.props.message.loading) {
            this.props.message.fetchMax()
        }
    }


    appEvents(E) {
        E.bus(AppEvents.Files)
            .only(event => event.fileId === this.props.message.raw.media.photo.id)
            .on("fileDownloaded", this.onFileDownloaded)
            .on("fileDownloading", this.onFileDownloading)
    }

    render() {
        return (
            <figure className={["photo", !this.props.message.loaded ? "thumbnail" : ""]} onClick={this.openMediaViewer}>

                <img src={this.props.message.srcUrl || this.props.message.thumbnail} alt="Image"/>

            </figure>
        )
    }

    openMediaViewer = event => {
        UIEvents.MediaViewer.fire("showMessage", this.props.message)
    }

    onFileDownloaded = event => {
        console.log("onFileDownloaded!")
        this.forceUpdate()
    }

    onFileDownloading = event => {
    }
}

