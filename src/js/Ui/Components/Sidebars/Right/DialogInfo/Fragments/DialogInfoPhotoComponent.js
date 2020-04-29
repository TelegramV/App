import VComponent from "../../../../../../V/VRDOM/component/VComponent";
import AppEvents from "../../../../../../Api/EventBus/AppEvents";
import UIEvents from "../../../../../EventBus/UIEvents";


// макс перепиши цю діч(
// гатова! - @undrfined
// кайф, тільки наступного разу роби ctrl+alt+l
//   (в мене воно атоматом код форматить і чистить непотрібні імпорти) - @kohutd

export class DialogInfoPhotoComponent extends VComponent {

    init() {
        if (!this.props.message.loaded && !this.props.message.loading) {
            this.props.message.fetchMax()
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Files)
            .filter(event => event.fileId === this.props.message.raw.media.photo.id)
            .on("fileDownloaded", this.onFileDownloaded)
            .on("fileDownloading", this.onFileDownloading)
    }

    render() {
        return (
            <figure style={{"cursor": "pointer"}}
                    className={["photo rp", !this.props.message.loaded ? "thumbnail" : ""]}
                    onClick={this.openMediaViewer}>

                <img src={this.props.message.srcUrl || this.props.message.thumbnail} alt="Image"/>

            </figure>
        )
    }

    openMediaViewer = event => {
        UIEvents.MediaViewer.fire("showMessage", {message: this.props.message})
    }

    onFileDownloaded = event => {
        console.log("onFileDownloaded!")
        this.forceUpdate()
    }

    onFileDownloading = event => {
    }
}

