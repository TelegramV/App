import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {MessageType} from "../../../../../../api/messages/Message"
import MessageWrapperComponent from "./common/MessageWrapperComponent"
import MapComponent from "./common/MapComponent"

class LocationMessageComponent extends GeneralMessageComponent {

    h() {
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
            <MessageWrapperComponent message={this.message} noPad>
                {venue}
                <MapComponent map={geo}/>
            </MessageWrapperComponent>
        )
    }
}

export default LocationMessageComponent;