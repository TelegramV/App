import VComponent from "../../../../../V/VRDOM/component/VComponent";
import VRDOM from "../../../../../V/VRDOM/VRDOM";
import StickerComponent from "../Message/Common/StickerComponent"
import {VideoComponent} from "../../../Basic/videoComponent"
import {ChatInputManager} from "./ChatInputComponent"
import {emojiCategories, replaceEmoji} from "../../../../Utils/replaceEmoji"
import {StickerManager} from "../../../../../Api/Stickers/StickersManager"
import {FileAPI} from "../../../../../Api/Files/FileAPI"
import MTProto from "../../../../../MTProto/External"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import VApp from "../../../../../V/vapp"
import lottie from "../../../../../../../vendor/lottie-web"

// this should be StatelessComponent
export default class ComposerComponent extends VComponent {
    identifier = "composer";

    stateless = {
        pane: "emoji",
        emojiCategory: "people",
        emojiCategories: [
            {name: "recent", icon: "sending"},
            {name: "people", icon: "smile"},
            {name: "nature", icon: "animals"},
            {name: "food", icon: "eats"},
            {name: "travel", icon: "car"},
            {name: "activity", icon: "sport"},
            {name: "objects", icon: "lamp"},
            {name: "symbols", icon: "flag"},
        ],
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
                    <div class="emoji-wrapper">
                        <div class="emoji-table">
                            {this.stateless.emojiCategories.map(category => (
                                <div class={`${category.name} scrollable`} data-category={category.name}/>
                            ))}
                        </div>
                        <div class="emoji-types">
                            {this.stateless.emojiCategories.map(category => (
                                <div className="rp rps emoji-type-item"
                                     data-category={category.name}
                                     onClick={this.onClickSwitchEmojiCategory}>
                                    <i className={`tgico tgico-${category.icon}`}/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div class="sticker-wrapper hidden">
                        <div class="sticker-table">
                            <div class="selected scrollable"/>
                        </div>
                        <div class="sticker-packs">
                            <div class="rp sticker-packs-item selected">
                                <i class="tgico tgico-sending"/>
                            </div>
                        </div>
                    </div>
                    <div class="gif-wrapper hidden">
                        <div class="gif-masonry scrollable">
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.emojiPanel = this.$el.querySelector(".emoji-wrapper");
        this.stickersPanel = this.$el.querySelector(".sticker-wrapper");
        this.gifPanel = this.$el.querySelector(".gif-wrapper");

        const $selected = this.emojiPanel.querySelector(".emoji-table").querySelector(".people");
        $selected.classList.add("selected");
        $selected.innerText = emojiCategories["people"];
        replaceEmoji($selected);
        this.$el.querySelector(".emoji-table > .selected").childNodes.forEach(node => {
            node.addEventListener("click", this.onClickEmoji);
        });
    }

    onHide = () => {
        this.stickersPanel.querySelector(".selected").childNodes.forEach(node => {
            if (node.id) {
                lottie.pause(node.id);
            }
        });

        this.gifPanel.querySelectorAll("video").forEach(video => {
            video.pause();
        });

        this.paused = true;
    }

    onShow = () => {
        if (!this.paused) {
            return;
        }

        this.gifPanel.querySelectorAll("video").forEach(video => {
            video.play();
        });

        this.paused = false;
    }

    togglePane = (name: string) => {
        if (this.stateless.pane === name) {
            return;
        }

        this.$el.querySelector(".tab-selector").childNodes.forEach($node => {
            $node.classList.remove("selected");
        });

        this.$el.querySelector(`.tab-selector > [data-tab-name=${name}]`).classList.add("selected");

        this.emojiPanel.classList.add("hidden");
        this.gifPanel.classList.add("hidden");
        this.stickersPanel.classList.add("hidden");

        this[`${name}Panel`].classList.remove("hidden");

        this.stateless.pane = name;
    }

    onClickOpenEmoji = () => {
        this.togglePane("emoji");
    }

    onClickOpenStickers = () => {
        this.togglePane("stickers");
    }

    onClickOpenGif = () => {
        this.togglePane("gif");
    }

    onClickSwitchEmojiCategory = (ev) => {
        const $el = ev.currentTarget;
        const category = $el.getAttribute("data-category");

        if (!category || this.stateless.emojiCategory === category) {
            return;
        }

        this.stateless.emojiCategory = category;

        this.$el.querySelector(".emoji-types").childNodes
            .forEach(node => node.classList.remove("selected"));

        $el.classList.add("selected");

        this.$el.querySelector(".emoji-table").childNodes
            .forEach(node => node.classList.remove("selected"));

        const $emojiPanel = this.$el.querySelector(".emoji-table")
            .querySelector("." + category);

        $emojiPanel.classList.add("selected");

        if ($emojiPanel.childElementCount === 0) {
            $emojiPanel.innerText = emojiCategories[category];

            replaceEmoji($emojiPanel);

            this.$el.querySelector(".emoji-table > .selected").childNodes.forEach(node => {
                node.addEventListener("click", this.onClickEmoji);
            });
        }
    }

    onClickEmoji = (ev) => {
        ChatInputManager.appendText(ev.currentTarget.alt);
    }

    loadInstalledStickerSets = () => {
        if (this.stickersInit) return;
        StickerManager.getInstalledStickerSets().then(async sets => {
            let container = this.stickersPanel.querySelector(".sticker-packs");
            for (const set of sets) {
                if (set.set.thumb) {
                    //download thumb
                } else { //first sticker
                    let url = await FileAPI.getThumb(set.documents[0], "min");
                    VRDOM.append(<StickerSetItemFragment setId={set.set.id} url={url}
                                                         click={this._stickerPackClick.bind(this)}/>, container);
                }
            }
        })
        this.stickersInit = true;
    }

    _stickerPackClick = (ev) => {
        let id = ev.currentTarget.getAttribute("set-id");
        if (!id) return;
        this.setStickerSet(id);
    }

    setStickerSet = (id) => {
        let table = this.stickersPanel.querySelector(".selected");
        while (table.firstChild) table.removeChild(table.firstChild);
        let set = StickerManager.getCachedStickerSet(id);
        for (const sticker of set.documents) {
            VRDOM.append(<StickerComponent width={75} sticker={sticker}/>, table);
        }
        this._bindStickerEvents();
    }

    loadRecentStickers = () => {
        return MTProto.invokeMethod("messages.getRecentStickers", {
            hash: 0
        }).then(response => {
            let packs = response.packs;
            let stickers = response.stickers;
            let table = this.stickersPanel.querySelector(".selected");
            for (let i = 0; i < Math.min(25, stickers.length); i++) {
                VRDOM.append(<StickerComponent width={75} sticker={stickers[i]}/>, table);
            }
        })
    }

    _bindStickerEvents = () => {
        this.$el.querySelector(".sticker-table > .selected").childNodes.forEach(node => {
            node.addEventListener("click", this._stickerClick);
        })
    }

    _stickerClick = (ev) => {
        let ref = ev.currentTarget.getAttribute("data-component-id");
        if (!ref) return;
        let sticker = VApp.mountedComponents.get(ref).sticker;
        AppSelectedChat.current.api.sendExistingMedia(sticker);
    }

    loadSavedGifs = () => {
        let masonry = this.gifPanel.querySelector(".gif-masonry");
        MTProto.invokeMethod("messages.getSavedGifs").then(response => {
            for (const gif of response.gifs) {
                let size = FileAPI.getMaxSize(gif);
                const height = 100;
                let width = Math.max((size.w / size.h) * height, 40);
                VRDOM.append(<div class="masonry-item" css-width={width + "px"}><VideoComponent video={gif}/>
                </div>, masonry);
            }
            this._bindGifClickEvents();
        })
    }

    _bindGifClickEvents = () => {
        this.gifPanel.querySelector(".gif-masonry").childNodes.forEach(node => {
            node.firstChild.addEventListener("click", this._gifClick);
        })
    }

    _gifClick = (ev) => {
        let ref = ev.currentTarget.getAttribute("data-component-id");
        if (!ref) return;
        let gif = VApp.mountedComponents.get(ref).props.object;
        AppSelectedChat.Current.api.sendExistingMedia(gif);
    }
}

const StickerSetItemFragment = ({setId, url, click}) => {
    return (
        <div class="sticker-packs-item"
             set-id={setId} onClick={click}>
            <img src={url} alt="Sticker Pack"/>
        </div>
    )
}