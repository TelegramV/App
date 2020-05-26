import SettingsPane from "../SettingsPane"
import WallpaperManager from "../../../../../Managers/WallpaperManager"
import VRDOM from "../../../../../../V/VRDOM/VRDOM"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import {askForFile} from "../../../../../Utils/utils"
import {ButtonWithIconFragment} from "../../../Fragments/ButtonWithIconFragment";
import {ButtonWithCheckboxFragment} from "../../../Fragments/ButtonWithCheckboxFragment";
import {SectionFragment} from "../../../Fragments/SectionFragment";
import UIEvents from "../../../../../EventBus/UIEvents"
import SquareComponent from "./SquareComponent"

class BackgroundImageComponent extends SettingsPane {
    name = "Chat Background";
    barName = "background-image";
    galleryRef = VComponent.createRef();

    wallpapers = [];

    appEvents(E) {
        super.appEvents(E);

        E.bus(UIEvents.General)
            .on("wallpaper.fetched", this.onWallpaperFetched)
    }

    render() {
        return (
            <div class="sidebar sub-settings background-image scrollable">
                {this.makeHeader()}

                <SectionFragment noBorders>
                    <ButtonWithIconFragment icon="cameraadd" name="Upload Wallpaper" onClick={this.uploadBackground}/>

                    <ButtonWithIconFragment icon="colorize"
                                            name="Set a Color"
                                            onClick={() => this.openPane("background-color")}/>

                    <ButtonWithCheckboxFragment name="Blur Wallpaper Image"
                                                onClick={this._blurCheckClick}
                                                checked/>

                    <div ref={this.galleryRef} className="gallery background-list"/>
                </SectionFragment>

            </div>
        )
    }

    uploadBackground = () => {
        askForFile("image/*", buffer => {
            let blob = new Blob([buffer]);
            let url = URL.createObjectURL(blob);
            WallpaperManager.setWallpaper(url);
        }, true)
    }

    onWallpaperFetched = event => {
        this.wallpapers = event.wallpapers;
        for (let wallpaper of this.wallpapers) {
            if (wallpaper.pattern) continue;
            WallpaperManager.fetchPreview(wallpaper).then(url => {
                VRDOM.append(<SquareComponent click={this._fragmentClick} src={url}
                                          wallpaper={wallpaper.document.id}/>, this.galleryRef.$el);
            })
        }
    }

    _fragmentClick = (ev) => {
        const wallpaperId = ev.currentTarget.getAttribute("wallpaper");
        let wallpaper = this.wallpapers.find(wp => wp.document.id === wallpaperId);
        if (wallpaper) {
            WallpaperManager.requestAndInstall(wallpaper);
        }
    }

    _blurCheckClick = (ev) => {
        const wallpaper = document.getElementById("wallpaper");
        let elem = ev.currentTarget;
        let checkbox = elem.querySelector("input");
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
            wallpaper.classList.add("blur");
        } else {
            wallpaper.classList.remove("blur");
        }
    }

    barWillOpen() {
        WallpaperManager.fetchAllWallPapers();
    }
}

export default BackgroundImageComponent;