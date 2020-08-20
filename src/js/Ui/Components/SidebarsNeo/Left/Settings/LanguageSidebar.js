import { LeftSidebar } from "../LeftSidebar";
import { Section } from "../../Fragments/Section";
import RadioButton from "../../Fragments/RadioButton";
import { RadioSection } from "../../Fragments/RadioSection";
import Locale from "../../../../../Api/Localization/Locale"
import UIEvents from "../../../../EventBus/UIEvents";
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import "./LanguageSidebar.scss"

export class LanguageSidebar extends LeftSidebar {

    state = {
        languages: [],
        backdrop: false
    }

    radiosRef = VComponent.createComponentRef();

    appEvents(E) {
        super.appEvents(E);

        E.bus(UIEvents.General)
            .on("language.changed", this.onLanguageChange)
    }

    content(): * {
        const classes = {
            "language-selection": true,
            "backdrop": this.state.backdrop
        }
        return <this.contentWrapper>
            <div className={classes}>
                <RadioSection radios={this.state.languages} onSelect={this.selectLanguage} ref={this.radiosRef}/>
            </div>
        </this.contentWrapper>
    }

    componentDidMount() {
        this.refreshLanguageList();
    }

    selectLanguage = (index) => {
        let language = this.state.languages[index];
        if(language?.lang_code && language.lang_code !== Locale.currentLanguageCode) {
            Locale.setLanguage(language.lang_code)
            this.setState({
                backdrop: true
            })
        }
    }

    onLanguageChange = (event) => {
        this.refreshLanguageList(event.code);
        this.setState({
            backdrop: false
        })
    }

    refreshLanguageList = (newLang) => {
        return Locale.getLanguages().then(languages => {
            let langList = [];
            if(!languages.find(e => e.lang_code === Locale.currentLanguageInfo.lang_code)) {
                languages.unshift(Locale.currentLanguageInfo); // TG not returning our custom language
            }
            for (let lang of languages) {
                langList.push({
                    text: lang.native_name,
                    description: lang.name,
                    lang_code: lang.lang_code
                })
            }
            this.setState({
                languages: langList,
            })
            this.radiosRef.component.check(languages.findIndex(l => l.lang_code === Locale.currentLanguageCode));
        })
    }

    get title(): string | * {
        return this.l("lng_settings_language");
    }
}