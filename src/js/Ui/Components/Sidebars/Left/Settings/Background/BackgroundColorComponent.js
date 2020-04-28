import SettingsPane from "../SettingsPane"
import VComponent from "../../../../../../V/VRDOM/component/VComponent";
import VInput from "../../../../../Elements/Input/VInput"

export default class BackgroundColorComponent extends SettingsPane {
    barName = "background-color";
    palette = VComponent.createRef()

    constructor(props) {
        super(props);

        this.name = "Set a Color"

        this.defaultColors = [
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
    }

    render() {
        return (
            <div class="sidebar sub-settings background-color scrollable">
                {this.makeHeader()}
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
            </div>
        )
    }

    generateColorList = () => {
        let elements = [];
        for (const color of this.defaultColors) {
            elements.push(<ColorSquareFragment color={color} click={this._fragmentClick}/>);
        }
        return elements;
    }

    applyColor = (color) => {
        window.document.documentElement.style.setProperty("--chat-bg-image", "none");
        window.document.documentElement.style.setProperty("--chat-bg-color", color);
    }

    _fragmentClick = (ev) => {
        this.applyColor(ev.currentTarget.getAttribute("color"));
    }
}

const ColorSquareFragment = ({color, click}) => {
    return (
        <div class="color-square" color={color} onClick={click} style={"background-color:" + color}/>
    )
}