import SettingsPane from "./SettingsPane"
import {ButtonWithIconFragment} from "../../Fragments/ButtonWithIconFragment";
import {SectionFragment} from "../../Fragments/SectionFragment";
import VSlider from "../../../Elements/VSlider";
import VInput from "../../../../Elements/Input/VInput";
import keval from "../../../../../Keval/keval";

export default class BackgroundColorComponent extends SettingsPane {
    barName = "general-settings";

    state = {
        phoneCallsBridge: "ws://127.0.0.1:1488"
    }

    constructor(props) {
        super(props);

        this.name = "General"
    }

    init() {
        keval.getItem("phoneCallsBridge").then(l => {
            this.setState({
                phoneCallsBridge: l || "ws://127.0.0.1:1488"
            })
        })
    }

    render() {
        return (
            <div class="sidebar sub-settings general-settings scrollable">
                {this.makeHeader(true)}

                <SectionFragment title="Settings">
                    <ButtonWithIconFragment icon="photo" name="Chat Background"
                                            onClick={_ => this.openPane("background-image")}/>
                    <VInput label="Phone calls bridge"
                            onInput={this.changePhoneCallsBridge} value={this.state.phoneCallsBridge}/>
                    {/*<VSlider label="Message Text Size" value={16}/>*/}
                </SectionFragment>
            </div>
        )
    }

    changePhoneCallsBridge = (event) => {
        keval.setItem("phoneCallsBridge", event.target.value)
    }
}