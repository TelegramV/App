import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import Localization from "../../../../../Api/Localization/Localization"
import {ChatInputManager} from "./ChatInputComponent"
import {text2emoji} from "../../../../Plugins/EmojiTextInterceptor"

export default class SuggestionComponent extends StatefulComponent {
    identifier = "suggestion";

    state = {
        type: "emoji",
        currentSuggestion: [],
        visible: false
    };

    appEvents(E) {
        E.bus(UIEvents.General)
            .on("textarea.onInput", this.scheduleSuggestion);
    }

    render() {
        let classes = {
            "suggestion": true,
            "scrollable-x": true,
            "emoji-suggestion": this.state.type == "emoji",
            "visible": this.state.visible
        }
        return (
            <div className={classes}>
                {this.state.currentSuggestion?.map(em => <span>{em}</span>)}
            </div>
        )
    }

    componentDidMount() {
    }

    show = () => {
        this.setState({
            visible: true
        })
        this.onShow();
    }

    hide = () => {
        this.setState({
            visible: false
        })
        this.onHide();
    }

    onHide = () => {

    }

    onShow = () => {
        if (this.state.type == "emoji") {
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
                    this.setState({
                        currentSuggestion: []
                    })
                    this.hide();
                } else {
                    if (this.state.currentSuggestion == list) return; //nothing changed
                    this.setState({
                        currentSuggestion: [] // hack, patcher replace img url, and previous emoji is visible while new loading
                    })
                    this.setState({
                        currentSuggestion: list
                    })
                    this.show();
                }
            })
        } else {
            if (this.state.visible) this.hide();
        }
    }
}