import MapComponent from "./mapComponent"
import MessageWrapperComponent from "./messageWrapperComponent"
const LocationMessageComponent = ({message}) => {
	let geo = message.media.geo;
	return (
		<MessageWrapperComponent message={message}>
			<div class="message">
				<MapComponent long={geo.long} lat={geo.lat}/>
			</div>
		</MessageWrapperComponent>
	)
}

export default LocationMessageComponent;