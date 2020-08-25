import {LeftSidebar} from "../../../LeftSidebar";
import IconButton from "../../../../Fragments/IconButton";
import CheckboxButton from "../../../../Fragments/CheckboxButton";
import {Section} from "../../../../Fragments/Section";
import {askForFile} from "../../../../../../Utils/utils"
import WallpaperManager from "../../../../../../Managers/WallpaperManager"
import {BackgroundColorSidebar} from "./BackgroundColorSidebar"
import UIEvents from "../../../../../../EventBus/UIEvents";
import BackgroundPreviewComponent from "./BackgroundPreviewComponent"
import Settings from "../../../../../../../Api/Settings/Settings"
import keval from "../../../../../../../Keval/keval"
import "./BackgroundSidebar.scss"

export class BackgroundImageSidebar extends LeftSidebar {

    state = {
        blur: false,
        wallpapers: null,
        selected: 0
    }

	appEvents(E) {
        super.appEvents(E);

        E.bus(UIEvents.General)
            .on("wallpaper.fetched", this.onWallpaperFetched)
    }

	content(): * {
        return <this.contentWrapper>
        	<Section>
	        	<IconButton icon="cameraadd" text="Upload Wallpaper" onClick={_=>this.uploadBackground()}/>
	        	<IconButton icon="colorize" text="Pick a Color" onClick={_ => UIEvents.Sidebars.fire("push", BackgroundColorSidebar)}/>
	        	<CheckboxButton checked={this.state.blur} text="Blur Wallpaper Image" onClick={this.onBlurClick}/>
        	</Section>
        	<div className="gallery background-list">
                {this.generateWallpaperGrid()}
            </div>
        </this.contentWrapper>
    }

    get title(): string | * {
        return this.l("lng_settings_section_background")
    }

    componentDidMount() {
        Settings.initPromise.then(() => {
            let blur = Settings.get("background.blur");
            if(blur === undefined) {
                Settings.set("background.blur", false);
                blur = false;
            }
            this.setState({
                blur
            })
        })

        WallpaperManager.getSelectedId().then(id => {
            if(id) {
                this.setState({
                    selected: id
                })
            }
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextState.blur !== undefined && nextState.blur !== this.state.blur) {
            document.getElementById("wallpaper").classList.toggle("blur", nextState.blur);
        }
    }

    onShown(params) {
        WallpaperManager.fetchAllWallPapers();
    }

    generateWallpaperGrid = () => {
        if(!this.state.wallpapers) return undefined;

        let squares = [];
        for(let wallpaper of this.state.wallpapers) {
            squares.push(<BackgroundPreviewComponent click={this.previewClick} wallpaper={wallpaper} selected={wallpaper.id===this.state.selected}/>)
        }
        return squares;
    }

    onWallpaperFetched = event => {
        this.setState({
            wallpapers: event.wallpapers
        })
    }

    uploadBackground = () => {
        askForFile("image/*", buffer => {
            let blob = new Blob([buffer]);
            let url = URL.createObjectURL(blob);
            WallpaperManager.setWallpaper(url);
        }, true)
    }

    onBlurClick = ev => {
    	let value = !this.state.blur;
        Settings.set("background.blur", value)

        this.setState({
            blur: value
        })
    }

    previewClick = (wallpaper) => {
        WallpaperManager.requestAndInstall(wallpaper);
        this.setState({
            selected: wallpaper.id,
            blur: !wallpaper.pattern // disable blur for patterns
        })
    }
}
