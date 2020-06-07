import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import Localization from "../../../../../Api/Localization/Localization"
import {ChatInputManager} from "./ChatInputComponent"

export default class SuggestionComponent extends StatelessComponent {
    identifier = "suggestion";

    stateless = {
        type: "emoji",
    };

    appEvents(E) {
        E.bus(UIEvents.General)
            .on("textarea.onInput", this.scheduleSuggestion);
    }

    render() {
        let classes = {
            "suggestion": true,
            "emoji-suggestion": this.stateless.type == "emoji",
            "visible": this.visible
        }
        return (
            <div className={classes}>
                {this.currentSuggestion}
            </div>
        )
    }

    componentDidMount() {

    }

    show = () => {
        this.visible = true;
        this.forceUpdate();
        this.onShow();
    }

    hide = () => {
        this.visible = false;
        this.forceUpdate();
        this.onHide();
    }

    onHide = () => {

    }

    onShow = () => {
        if (this.stateless.type == "emoji") {
            let emojis = this.$el.querySelectorAll(".emoji");
            emojis.forEach(emoji => {
                emoji.addEventListener("click", this.onEmojiClick)
            });
        }
    }

    onEmojiClick = (ev) => {
        const alt = ev.currentTarget.alt;
        let el = ChatInputManager.textarea;
        let str = ChatInputManager.text;
        str = str.replace(new RegExp(this.currentEmojiKey + "$"), alt); //todo replace first relative to cursor
        el.textContent = str;
        ChatInputManager.chatInputTextareaRef.component.onInput();
        ChatInputManager.focus();

        this.hide();
    }

    scheduleSuggestion = () => {
        let lastText = ChatInputManager.text;
        if (lastText.trim().length == 0) {
            this.hide();
            return;
        }

        this.clearTimeouts();

        this.withTimeout(_ => {
            if (lastText === ChatInputManager.text) {
                this.makeSuggestion(lastText);
            }
        }, 500);
    }

    makeSuggestion = (text) => {
        //TODO suggest sticker
        let key = undefined;

        let split = text.split(/\s/);
        if (split.length > 1) {
            let last = split[split.length - 1];
            if (last.startsWith(":")) {
                key = last.substr(1);
                this.currentEmojiKey = last;
            }
        } else {
            if (text.length > 0) {
                key = text.trim();
                this.currentEmojiKey = key;
                if (key.startsWith(":")) {
                    key = key.substr(1);
                }
            } else {
                this.hide();
            }
        }

        if (key) {
            Localization.suggestEmojis(key).then(list => {
                if (list.length == 0) {
                    this.currentSuggestion = undefined;
                    this.hide();
                } else {
                    if (this.currentSuggestion == list) return; //nothing changed
                    this.currentSuggestion = list;
                    this.show();
                }
            })
        } else {
            if (this.visible) this.hide();
        }
    }
}