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
            window.document.documentElement.style.setProperty("--chat-bg-image", `url(${url})`);
        }, true)
    }

    applyWallpaper = (url) => {
        window.document.documentElement.style.setProperty("--chat-bg-image", `url(${url})`);
    }

    onWallpaperFetched = event => {
        this.wallpapers = event.wallpapers;
        for (let wallpaper of this.wallpapers) {
            if (wallpaper.pattern) continue;
            VRDOM.append(<SquareComponent click={this._fragmentClick}
                                          wallpaperId={wallpaper.document.id}/>, this.galleryRef.$el);
        }
    }

    _fragmentClick = (ev) => {
        const url = ev.currentTarget.getAttribute("url");
        if (url) {
            this.applyWallpaper(url);
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