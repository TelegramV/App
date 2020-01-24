import MapComponent from "./mapComponent"
import {MessageType} from "../../../../../../api/dataObjects/messages/message"
import MessageWrapperComponent from "./messageWrapperComponent"
const LocationMessageComponent = ({message}) => {
	let geo = message.media.geo;
	let venue = "";
	if(message.type == MessageType.VENUE) {
		venue = (
			<div class="venue">
				<div class="title">{message.media.title}</div>
				<div class="address">{message.media.address}</div>
			</div>
			)
	}
	return (
		<MessageWrapperComponent message={message} noPad>
			{venue}
			<div class="media-wrapper">
				<MapComponent long={geo.long} lat={geo.lat}/>
			</div>
		</MessageWrapperComponent>
	)
}

export default LocationMessageComponent;