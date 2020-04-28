import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import UIEvents from "../../../../../EventBus/UIEvents"

export default class SquareComponent extends VComponent {

	init() {
		super.init();
		this.state = {
			url: undefined
		}
	}

	appEvents(E) {
		E.bus(UIEvents.General)
		.on("wallpaper.ready", this._wallpaperLoaded)
	}

	_wallpaperLoaded = (event) => {
		if(event.id === this.props.wallpaperId) {
			let url = URL.createObjectURL(event.wallpaper);
			this.setState({
				url: url
			})
		}
	}

	render() {
		return (
			<div class="image-square" onClick={this.props.click} url={this.state.url} style={{"background-image": `url(${this.state.url})`}}/>
			)
	}
}