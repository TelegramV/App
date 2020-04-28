import SettingsPane from "./SettingsPane"
import {ButtonWithIconFragment} from "../../Fragments/ButtonWithIconFragment";
import {SectionFragment} from "../../Fragments/SectionFragment";
import VSlider from "../../../Elements/VSlider";

export default class BackgroundColorComponent extends SettingsPane {
    barName = "general-settings";

    constructor(props) {
        super(props);

        this.name = "General"
    }

    render() {
        return (
            <div class="sidebar sub-settings general-settings scrollable">
                {this.makeHeader(true)}

                <SectionFragment title="Settings">
                    <ButtonWithIconFragment icon="photo" name="Chat Background"
                                            onClick={_ => this.openPane("background-image")}/>
                    <VSlider label="Message Text Size" value={16}/>
                </SectionFragment>
            </div>
        )
    }
}