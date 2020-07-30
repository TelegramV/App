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
        Locale.getLanguages().then(languages => {
            let langList = [];
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

    selectLanguage = (index) => {
        let language = this.state.languages[index];
        if(!language.checked) Locale.setLanguage(language.code)
    }

    onLanguageChange = (event) => {
        let newList = [...this.state.languages]
        newList.find(el => el.code === event.code).checked = true;
        this.setState({
            languages: newList
        })
    }

    get title(): string | * {
        return this.l("lng_settings_language");
    }
}