import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import {MessageType} from "../../../../../Api/Messages/Message"
import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import MapComponent from "./Common/MapComponent"

class LocationMessageComponent extends GeneralMessageComponent {

    render() {
        let geo = this.props.message.raw.media.geo;
        let venue = "";
        if (this.props.message.type === MessageType.VENUE) {
            venue = (
                <div class="venue">
                    <div class="title">{this.props.message.raw.media.title}</div>
                    <div class="address">{this.props.message.raw.media.address}</div>
                </div>
            )
        }

        return (
            <MessageWrapperFragment message={this.props.message} noPad showUsername={false} bubbleRef={this.bubbleRef}>
                {venue}
                <MapComponent map={geo}/>
            </MessageWrapperFragment>
        )
    }
}

export default LocationMessageComponent;