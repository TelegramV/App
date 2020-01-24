import MapComponent from "./mapComponent"
import {MessageType} from "../../../../../../api/dataObjects/messages/Message"
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
		<MessageWrapperComponent message={message}>
			<div class="message no-pad">
				{venue}
				<div class="media-wrapper">
					<MapComponent long={geo.long} lat={geo.lat}/>
				</div>
			</div>
		</MessageWrapperComponent>
	)
}

export default LocationMessageComponent;