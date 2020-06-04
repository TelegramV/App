import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import {MessageType} from "../../../../../Api/Messages/Message"
import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import {FileAPI} from "../../../../../Api/Files/FileAPI";

class LocationMessageComponent extends GeneralMessageComponent {

	componentDidMount() {
		super.componentDidMount();
		let geo = this.props.message.geo;
		const zoom = this.props.message.zoom;
		const scale = 1;

		//TODO FileManager
		let fl = FileAPI.prepareWebFileLocation(geo, 300, 300, zoom, scale);
		this.assure(FileAPI.getWebFile(fl)).then(url => {
			this.url = url;
			this.forceUpdate();
		})
	}

    render({message}) {
        let geo = message.geo;
        let venue = "";
        console.log(message.type)
        if (message.type === MessageType.VENUE) {
            venue = (
                <div class="venue">
                    <div class="title">{message.raw.media.title}</div>
                    <div class="address">{message.raw.media.address}</div>
                </div>
            )
        }

        return (
            <MessageWrapperFragment message={message} noPad showUsername={false} bubbleRef={this.bubbleRef}>
                {venue}
                <div class="map-wrapper" onClick={this.openFullMap}>
                	<img class="map" src={this.url}/>
	                <div class="pin-point">
		                <i class="tgico tgico-location"/>
		            </div>
                </div>
            </MessageWrapperFragment>
        )
    }

    openFullMap = () => {
    	let url = this.props.message.fullUrl;
    	let win = window.open(url, '_blank');
    	win.focus();
    }
}

export default LocationMessageComponent;