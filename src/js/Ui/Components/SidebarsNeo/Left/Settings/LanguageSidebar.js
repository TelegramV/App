import { LeftSidebar } from "../LeftSidebar";
import { Section } from "../../Fragments/Section";
import RadioButton from "../../Fragments/RadioButton";
import { RadioSection } from "../../Fragments/RadioSection";
import Locale from "../../../../../Api/Localization/Locale"
import UIEvents from "../../../../EventBus/UIEvents";

export class LanguageSidebar extends LeftSidebar {

    state = {
        languages: []
    }

    appEvents(E) {
        super.appEvents(E);

        E.bus(UIEvents.General)
            .on("language.changed", this.onLanguageChange)
    }

    content(): * {
        return <this.contentWrapper>
            <RadioSection radios={this.state.languages} onSelect={this.selectLanguage}/>
        </this.contentWrapper>
    }

    componentDidMount() {
        this.refreshLanguageList();
    }

    selectLanguage = (index) => {
        let language = this.state.languages[index];
        if(!language.checked) Locale.setLanguage(language.code)
    }

    onLanguageChange = (event) => {
        this.refreshLanguageList().then(() => {
            this.forceUpdate(); // radio buttons work strangely without forceUpdate
        })
    }

    refreshLanguageList = () => {
        return Locale.getLanguages().then(languages => {
            let langList = [];
            if(!languages.find(e => e.lang_code === Locale.currentLanguageInfo.lang_code)) {
                languages.unshift(Locale.currentLanguageInfo); // TG not returned our custom language
            }
            for (let lang of languages) {
                langList.push({
                    text: lang.native_name,
                    description: lang.name,
                    code: lang.lang_code,
                    checked: Locale.currentLanguageCode === lang.lang_code
                })
            }
            this.setState({
                languages: langList
            })
        })
    }

    get title(): string | * {
        return this.l("lng_settings_language");
    }
}