import StatefulComponent from "../../../../../../../V/VRDOM/component/StatefulComponent"
import WallpaperManager from "../../../../../../Managers/WallpaperManager"

export default class BackgroundPreviewComponent extends StatefulComponent {

	state = {
		url: null
	}

	render() {
		let classes = {
			"image-square": true,
			selected: this.props.selected
		}
		return (
        <div class={classes} onClick={_ => this.props.click(this.props.wallpaper)} css-background-image={this.urlOrNone()}/>
        )
	}

	componentDidMount() {
		WallpaperManager.fetchPreview(this.props.wallpaper).then(url => {
			this.setState({
				url: url
			})
		});
	}

	urlOrNone = () => { //url(none) throws 404
		return this.state.url ? `url(${this.state.url})` : "none";
	}
}