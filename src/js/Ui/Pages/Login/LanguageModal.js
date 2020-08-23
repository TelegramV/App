import TranslatableStatefulComponent from "../../../V/VRDOM/component/TranslatableStatefulComponent"
import {ModalHeaderFragment} from "../../Components/Modals/ModalHeaderFragment"
import Locale from "../../../Api/Localization/Locale"
import VUI from "../../VUI"

export default class LanguageModal extends TranslatableStatefulComponent {

    state = {
        languages: []
    }

    render() {
        return (
            <div class="language-select-modal">
                <ModalHeaderFragment title={this.l("lng_languages", "", "Languages")} close/>
                <div class="scrollable">
                    <div class="language-list">
                        {this.state.languages.length === 0 && <div class="loading">Loading...</div>}
                        {this.state.languages.map(lang => <LanguageFragment name={lang.native_name} code={lang.lang_code}/>)}
                    </div>
                </div>
            </div>
            )
    }

    componentDidMount() {
        Locale.getLanguages().then(list => {
            this.setState({
                languages: list
            })
        })
    }
}

const LanguageFragment = ({code, name}) => {
    return (
        <div class="language rp" onClick={() => {
            Locale.setLanguage(code);
            VUI.Modal.close();
        }}>
            {name}
        </div>
    )
}