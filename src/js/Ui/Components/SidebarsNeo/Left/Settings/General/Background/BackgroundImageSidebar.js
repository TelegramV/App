import {LeftSidebar} from "../../../LeftSidebar";
import IconButton from "../../../../Fragments/IconButton";
import CheckboxButton from "../../../../Fragments/CheckboxButton";
import {Section} from "../../../../Fragments/Section";
import {askForFile} from "../../../../../../Utils/utils"
import WallpaperManager from "../../../../../../Managers/WallpaperManager"
import {BackgroundColorSidebar} from "./BackgroundColorSidebar"
import UIEvents from "../../../../../../EventBus/UIEvents";
import "./BackgroundSidebar.scss"

export class BackgroundImageSidebar extends LeftSidebar {
	content(): * {
        return <this.contentWrapper>
        	<Section>
	        	<IconButton icon="cameraadd" text="Upload Wallpaper" onClick={_=>this.uploadBackground()}/>
	        	<IconButton icon="colorize" text="Pick a Color" onClick={_ => UIEvents.Sidebars.fire("push", BackgroundColorSidebar)}/>
	        	<CheckboxButton checked text="Blur Wallpaper Image" onClick={this.onBlurClick}/>
        	</Section>
        	<div className="gallery background-list"/>
        </this.contentWrapper>
    }

    get title(): string | * {
        return "Chat Background"
    }

    uploadBackground = () => {
        askForFile("image/*", buffer => {
            let blob = new Blob([buffer]);
            let url = URL.createObjectURL(blob);
            WallpaperManager.setWallpaper(url);
        }, true)
    }

    onBlurClick = (value) => {
    	console.log(value)
        const wallpaper = document.getElementById("wallpaper");
        if (value) {
            wallpaper.classList.add("blur");
        } else {
            wallpaper.classList.remove("blur");
        }
    }
}