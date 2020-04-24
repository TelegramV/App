import SettingsPane from "../SettingsPane"
import WallpaperManager from "../../../../../Managers/WallpaperManager"
import VRDOM from "../../../../../../V/VRDOM/VRDOM"
import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import VCheckbox from "../../../../Elements/VCheckbox"
import {askForFile} from "../../../../../Utils/utils"
import {ButtonWithIconFragment} from "../../../Fragments/ButtonWithIconFragment";
import {ButtonWithCheckboxFragment} from "../../../Fragments/ButtonWithCheckboxFragment";
import {SectionFragment} from "../../../Fragments/SectionFragment";

export default class BackgroundImageComponent extends SettingsPane {
    barName = "background-image";

    constructor(props) {
        super(props);

        this.name = "Chat Background";

        this.galleryRef = VComponent.createRef();
    }

    componentDidMount() {
        // this.withTimeout(_=>this._fillImages(WallpaperManager.wallpapersDocumentCache),30000);
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

    _fillImages = (cache) => {
        console.log("Filling background settings...")
        for (const key in cache) {
            VRDOM.append(<ImageSquareFragment id={key} url={cache[key]}
                                              click={this._fragmentClick}/>, this.galleryRef.$el)
        }
    }

    applyWallpaper = (id) => {
        let url = WallpaperManager.wallpapersDocumentCache[id];
        if (url) {
            window.document.documentElement.style.setProperty("--chat-bg-image", `url(${url})`);
        }
    }

    _fragmentClick = (ev) => {
        const id = ev.currentTarget.getAttribute("wallpaper-id");
        if (id) {
            this.applyWallpaper(id);
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

const ImageSquareFragment = ({id, url, click}) => {
    return (
        <div class="image-square" wallpaper-id={id} onClick={click} style={`background-image: url("${url}")`}/>
    )
}