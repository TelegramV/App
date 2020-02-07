import SettingsPane from "../SettingsPane"
import {ButtonWithIconFragment} from "../SettingsComponent"
import WallpaperManager from "../../../../../../wallpaperManager"
import VRDOM from "../../../../../../v/vrdom/VRDOM"
import {VComponent} from "../../../../../../v/vrdom/component/VComponent"
import CheckboxComponent from "../../../../components/input/checkboxComponent"

export default class BackgroundImageComponent extends SettingsPane {
	barName = "background-image";

	constructor(props) {
		super(props);

		this.name = "Chat Background";

		this.galleryRef = VComponent.createRef();
	}

	mounted() {
		// this.withTimeout(_=>this._fillImages(WallpaperManager.wallpapersDocumentCache),30000);
	}

	h() {
		return (
			<div class="sidebar sub-settings background-image scrollable">
				{this.makeHeader()}
				<ButtonWithIconFragment icon="cameraadd" name="Upload Wallpaper" click={_ => {/*nothing*/}}/>
				<ButtonWithIconFragment icon="colorize" name="Set a Color" click={_ =>this.openPane("background-color")}/>
				<ButtonWithIconFragment name="Blur Wallpaper Image" click={this._blurCheckClick}>
					<CheckboxComponent checked={true}/>
				</ButtonWithIconFragment>
				<div ref={this.galleryRef} class="gallery background-list">
				</div>
			</div>
			)
	}

	_fillImages = (cache) => {
		console.log("Filling background settings...")
		for(const key in cache) {
			VRDOM.append(<ImageSquareFragment id={key} url={cache[key]} click={this._fragmentClick}/>, this.galleryRef.$el)
		}
	}

	applyWallpaper = (id) => {
		let url = WallpaperManager.wallpapersDocumentCache[id];
		if(url) {
			window.document.documentElement.style.setProperty("--chat-bg-image", `url(${url})`);
		}
	}

	_fragmentClick = (ev) => {
		const id = ev.currentTarget.getAttribute("wallpaper-id");
		if(id) {
			this.applyWallpaper(id);
		}
	}

	_blurCheckClick = (ev) => {
		const wallpaper = document.getElementById("wallpaper");
		let elem = ev.currentTarget;
		let checkbox = elem.querySelector("input");
		checkbox.checked = !checkbox.checked;
		if(checkbox.checked) {
			wallpaper.classList.add("blur");
		} else {
			wallpaper.classList.remove("blur");
		}
	}
}

const ImageSquareFragment = ({id, url, click}) => {
	return(
		<div class="image-square" wallpaper-id={id} onClick={click} style={`background-image: url("${url}")`}/>
		)
}