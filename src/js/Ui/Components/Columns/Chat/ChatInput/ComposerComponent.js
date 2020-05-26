import AppSelectedChat from "../../../../Reactive/SelectedChat"
import VApp from "../../../../../V/vapp"
import lottie from "../../../../../../../vendor/lottie-web"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"
import StickersComposerComponent from "./StickersComposerComponent"
import EmojiComposerComponent from "./EmojiComposerComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import GifsComposerComponent from "./GifsComposerComponent"

export default class ComposerComponent extends StatelessComponent {
    identifier = "composer";

    stateless = {
        panel: "emoji",
        stickerSet: null,
        allStickers: [],
    };

    render() {
        return (
            <div class="composer" onMouseEnter={this.props.mouseEnter} onMouseLeave={this.props.mouseLeave}>
                <div className="tab-selector">
                    <div data-tab-name="emoji" className="item rp rps selected" onClick={this.onClickOpenEmoji}>
                        <span>Emoji</span>
                    </div>
                    <div data-tab-name="stickers" className="item rp rps" onClick={this.onClickOpenStickers}>
                        <span>Stickers</span>
                    </div>
                    <div data-tab-name="gif" className="item rp rps" onClick={this.onClickOpenGif}>
                        <span>GIFs</span>
                    </div>
                </div>

                <div class="content">
                    <EmojiComposerComponent/>
                    <StickersComposerComponent/>
                    <GifsComposerComponent/>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.$emojiPanel = this.$el.querySelector(".emoji-wrapper");
        this.$stickersPanel = this.$el.querySelector(".sticker-wrapper");
        this.$gifPanel = this.$el.querySelector(".gif-wrapper");
    }

    onHide = () => {
        this.$stickersPanel.querySelector(".selected").childNodes.forEach(node => {
            if (node.id) {
                lottie.pause(node.id);
            }
        });

        this.$gifPanel.querySelectorAll("video").forEach(video => {
            video.pause();
        });

        this.paused = true;
    }

    onShow = () => {
        if (!this.paused) {
            return;
        }

        this.$gifPanel.querySelectorAll("video").forEach(video => {
            video.play();
        });

        this.paused = false;
    }

    togglePanel = (name: string) => {
        if (this.stateless.panel === name) {
            return;
        }

        this.$el.querySelector(".tab-selector").childNodes.forEach($node => {
            $node.classList.remove("selected");
        });

        this.$el.querySelector(`.tab-selector > [data-tab-name=${name}]`).classList.add("selected");

        this.$emojiPanel.classList.add("hidden");
        this.$gifPanel.classList.add("hidden");
        this.$stickersPanel.classList.add("hidden");

        this[`$${name}Panel`].classList.remove("hidden");

        this.stateless.panel = name;

        UIEvents.General.fire("composer.togglePanel", {
            panel: name,
        })
    }

    onClickOpenEmoji = () => {
        this.togglePanel("emoji");
    }

    onClickOpenStickers = () => {
        this.togglePanel("stickers");
    }

    onClickOpenGif = () => {
        this.togglePanel("gif");
    }

    _gifClick = (ev) => {
        let ref = ev.currentTarget.getAttribute("data-component-id");
        if (!ref) return;
        let gif = VApp.mountedComponents.get(ref).props.object;
        AppSelectedChat.Current.api.sendExistingMedia(gif);
    }
}