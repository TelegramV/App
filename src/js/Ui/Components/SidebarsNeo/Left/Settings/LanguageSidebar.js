import {LeftSidebar} from "../LeftSidebar";
import {Section} from "../../Fragments/Section";
import RadioButton from "../../Fragments/RadioButton";
import {RadioSection} from "../../Fragments/RadioSection";

export class LanguageSidebar extends LeftSidebar {
    init() {
        super.init();
        this.languages = [
            {
                text: "English",
                description: "English",
                onClick: this.selectLanguage
            },
            {
                text: "Français",
                description: "French",
                onClick: this.selectLanguage
            },
            {
                text: "Deutsch",
                description: "German",
                onClick: this.selectLanguage
            },
            {
                text: "Italiano",
                description: "Italian",
                onClick: this.selectLanguage
            },
            {
                text: "Português",
                description: "Portuguese",
                onClick: this.selectLanguage
            },
            {
                text: "Русский",
                description: "Russian",
                onClick: this.selectLanguage
            },
            {
                text: "Español",
                description: "Spanish",
                onClick: this.selectLanguage
            },
            {
                text: "Українська",
                description: "Ukrainian",
                onClick: this.selectLanguage
            },
        ]
    }

    content(): * {
        return <this.contentWrapper>
            <RadioSection radios={this.languages} onSelect={this.selectLanguage}/>
        </this.contentWrapper>
    }

    get title(): string | * {
        return "Language"
    }

    selectLanguage = (language) => {

    }
}