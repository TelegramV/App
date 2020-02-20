import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {MessageType} from "../../../../../Api/Messages/Message"
import MessageWrapperFragment from "./common/MessageWrapperFragment"
import MapComponent from "./common/MapComponent"

class LocationMessageComponent extends GeneralMessageComponent {

    render() {
        let geo = this.message.raw.media.geo;
        let venue = "";
        if (this.message.type === MessageType.VENUE) {
            venue = (
                <div class="venue">
                    <div class="title">{this.message.raw.media.title}</div>
                    <div class="address">{this.message.raw.media.address}</div>
                </div>
            )
        }

        return (
            <MessageWrapperFragment message={this.message} noPad showUsername={false} bubbleRef={this.bubbleRef}>
                {venue}
                <MapComponent map={geo}/>
            </MessageWrapperFragment>
        )
    }
}

export default LocationMessageComponent;