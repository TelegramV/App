import SettingsPane from "../SettingsPane"
import WallpaperManager from "../../../../../Managers/WallpaperManager"
import VRDOM from "../../../../../../V/VRDOM/VRDOM"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import VCheckbox from "../../../../Elements/VCheckbox"
import {askForFile} from "../../../../../Utils/utils"
import {ButtonWithIconFragment} from "../../../Fragments/ButtonWithIconFragment";
import {ButtonWithCheckboxFragment} from "../../../Fragments/ButtonWithCheckboxFragment";
import {SectionFragment} from "../../../Fragments/SectionFragment";
import UIEvents from "../../../../../EventBus/UIEvents"
import SquareComponent from "./SquareComponent"

export default class BackgroundImageComponent extends SettingsPane {
    barName = "background-image";

    constructor(props) {
        super(props);

        this.name = "Chat Background";

        this.galleryRef = VComponent.createRef();

        this.wallpapers = [];
    }

    appEvents(E) {
        super.appEvents(E);
        E.bus(UIEvents.General)
        .on("wallpaper.fetched", this._wallpapersFetched)
        //.on("wallpaper.ready", this._wallpaperLoaded)
    }

    render() {
        return (
            <div class="sidebar sub-settings background-image scrollable">
                {this.makeHeader()}

                <SectionFragment noBorders>
                    <ButtonWithIconFragment icon="cameraadd" name="Upload Wallpaper" onClick={this._uploadBackground}/>
                    <ButtonWithIconFragment icon="colorize" name="Set a Color"
                                            onClick={_ => this.openPane("background-color")}/>
                    <ButtonWithCheckboxFragment name="Blur Wallpaper Image" onClick={this._blurCheckClick} checked/>

                    <div ref={this.galleryRef} className="gallery background-list"/>
                </SectionFragment>

            </div>
        )
    }

    _uploadBackground = () => {
        askForFile("image/*", buffer => {
            let blob = new Blob([buffer]);
            let url = URL.createObjectURL(blob);
            window.document.documentElement.style.setProperty("--chat-bg-image", `url(${url})`);
        }, true)
    }

    applyWallpaper = (url) => {
        window.document.documentElement.style.setProperty("--chat-bg-image", `url(${url})`);
    }

    /*_wallpaperLoaded = (event) => {
        let url = URL.createObjectURL(event.wallpaper);
        for(let i = 0; i<this.wallpapers.length; i++) {
            if(this.wallpapers[i].document.id == event.id) {
                this.urls[i] = url;
                this.forceUpdate();
                return;
            }
        }
    }*/

    _wallpapersFetched = (event) => {
        this.wallpapers = event.wallpapers;
        for(let wallpaper of this.wallpapers) {
            if (wallpaper.pattern) continue;
            VRDOM.append(<SquareComponent click={this._fragmentClick} wallpaperId={wallpaper.document.id}/>, this.galleryRef.$el);
            WallpaperManager.downloadWallpaper(wallpaper);
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
}
