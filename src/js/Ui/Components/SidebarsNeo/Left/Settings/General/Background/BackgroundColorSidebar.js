import {LeftSidebar} from "../../../LeftSidebar";
import WallpaperManager from "../../../../../../Managers/WallpaperManager"
import VInput from "../../../../../../Elements/Input/VInput";
import "./BackgroundSidebar.scss"

export class BackgroundColorSidebar extends LeftSidebar {
    defaultColors = [
        "#E6EBEE",
        "#B2CEE0",
        "#008DD0",
        "#C6E7CB",
        "#C4E1A6",
        "#60B16E",
        "#CCD0AF",
        "#A6A997",
        "#7A7072",
        "#FDD7AF",
        "#FDB76E",
        "#DD8851"
    ]

	content(): * {
        return <this.contentWrapper>
        	<div class="pallete">
                    <div className="grad" style="background: rgb(0, 255, 35);">
                        <div className="bg1"/>
                        <div className="bg2"/>
                    </div>
                    <div className="grad-bottom">
                        <div className="bg"/>
                    </div>
                </div>
                <div class="inputs">
                    <VInput type="text" label="HEX" value="#"/>
                    <VInput label="RGB"/>
                </div>
                <div class="gallery color-list">
                    {this.generateColorList()}
                </div>
        </this.contentWrapper>
    }

    get title(): string | * {
        return "Set a Color"
    }

    generateColorList = () => {
        let elements = [];
        for (const color of this.defaultColors) {
            elements.push(<ColorSquareFragment color={color} click={_=>WallpaperManager.setColor(color)}/>);
        }
        return elements;
    }
}

const ColorSquareFragment = ({color, click}) => {
    return (
        <div class="color-square" color={color} onClick={click} css-background-color={color}/>
    )
}