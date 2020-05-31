import AppEvents from "../../../../../../Api/EventBus/AppEvents";
import UIEvents from "../../../../../EventBus/UIEvents";
import StatelessComponent from "../../../../../../V/VRDOM/component/StatelessComponent"

export class DialogInfoPhotoComponent extends StatelessComponent {
    init() {
        if (!this.props.message.loaded && !this.props.message.loading) {
            this.props.message.fetchMax()
        }
    }

    appEvents(E) {
        E.bus(AppEvents.Files)
            .filter(event => event.file.id === this.props.message.raw.media.photo.id)
            .updateOn("download.start")
            .updateOn("download.done")
    }

    render({message}) {
        return (
            <figure style={{"cursor": "pointer"}}
                    className={["photo rp", message.loaded || "thumbnail"]}
                    onClick={this.openMediaViewer}>

                <img src={message.srcUrl || message.thumbnail} alt="Image"/>
            </figure>
        )
    }

    openMediaViewer = () => {
        UIEvents.MediaViewer.fire("showMessage", {message: this.props.message})
    }
}

