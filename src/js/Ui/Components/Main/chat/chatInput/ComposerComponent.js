import VComponent from "../../../../../V/VRDOM/component/VComponent";
import VF from "../../../../../V/VFramework";
import VRDOM from "../../../../../V/VRDOM/VRDOM";
import TabSelectorComponent from "../../basic/TabSelectorComponent"
import StickerComponent from "../message/common/StickerComponent"
import {VideoComponent} from "../../basic/videoComponent"
import {ChatInputManager} from "./ChatInputComponent"
import {emojiCategories, replaceEmoji} from "../../../../Utils/replaceEmoji"
import {StickerManager} from "../../../../../Api/Stickers/StickersManager"
import {FileAPI} from "../../../../../Api/Files/FileAPI"
import MTProto from "../../../../../MTProto/external"
import AppSelectedPeer from "../../../../Reactive/SelectedPeer"
import lottie from "lottie-web"

export default class ComposerComponent extends VComponent {
    constructor(props) {
        super(props);
        this.identifier = "composer"
        console.log(props)

        this.tabItems = [
            {
                text: "Emoji",
                click: this.openEmoji.bind(this),
                selected: true
            },
            {
                text: "Stickers",
                click: this.openStickers.bind(this),
            },
            {
                text: "GIFs",
                click: this.openGIF.bind(this),
            }
        ]


    }

    render() {
        return (
            <div class="composer" onMouseEnter={this.props.mouseEnter} onMouseLeave={this.props.mouseLeave}>
                <TabSelectorComponent items={this.tabItems}/>
                <div class="content">
                    <div class="emoji-wrapper">
                        <div class="emoji-table">
                            <div class="recent scrollable" data-category="recent"></div>
                            <div class="people scrollable" data-category="people"/>
                            <div class="nature scrollable" data-category="nature"></div>
                            <div class="food scrollable" data-category="food"></div>
                            <div class="travel scrollable" data-category="travel"></div>
                            <div class="activity scrollable" data-category="activity"></div>
                            <div class="objects scrollable" data-category="objects"></div>
                            <div class="symbols scrollable" data-category="symbols"></div>
                        </div>
                        <div class="emoji-types">
                            <div class="rp emoji-type-item" data-category="recent" onClick={this._emojiTypeClick}><i
                                class="tgico tgico-sending"/></div>
                            <div class="rp emoji-type-item selected" data-category="people"
                                 onClick={this._emojiTypeClick}><i class="tgico tgico-smile"/></div>
                            <div class="rp emoji-type-item" data-category="nature" onClick={this._emojiTypeClick}><i
                                class="tgico tgico-animals"/></div>
                            <div class="rp emoji-type-item" data-category="food" onClick={this._emojiTypeClick}><i
                                class="tgico tgico-eats"/></div>
                            <div class="rp emoji-type-item" data-category="travel" onClick={this._emojiTypeClick}><i
                                class="tgico tgico-car"/></div>
                            <div class="rp emoji-type-item" data-category="activity" onClick={this._emojiTypeClick}><i
                                class="tgico tgico-sport"/></div>
                            <div class="rp emoji-type-item" data-category="objects" onClick={this._emojiTypeClick}><i
                                class="tgico tgico-lamp"/></div>
                            <div class="rp emoji-type-item" data-category="symbols" onClick={this._emojiTypeClick}><i
                                class="tgico tgico-flag"/></div>
                        </div>
                    </div>
                    <div class="sticker-wrapper hidden">
                        <div class="sticker-table">
                            <div class="selected scrollable">

                            </div>
                        </div>
                        <div class="sticker-packs">
                            <div class="rp sticker-packs-item selected"><i class="tgico tgico-sending"/></div>
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
        this.stickerPanel = this.$el.querySelector(".sticker-wrapper");
        this.gifPanel = this.$el.querySelector(".gif-wrapper");

        //load start emoji page
        let selected = this.emojiPanel.querySelector(".emoji-table").querySelector(".people");
        selected.classList.add("selected");
        while (selected.firstChild) selected.removeChild(selected.firstChild)
        selected.innerText = emojiCategories["people"];
        replaceEmoji(selected);
        this._bindEmojiClickEvents();
    }

    onHide = () => {
        this.stickerPanel.querySelector(".selected").childNodes.forEach(node => {
            if (node.id) lottie.pause(node.id);
        })
        this.gifPanel.querySelectorAll("video").forEach(video => {
            video.pause();
        })
        this.paused = true;
    }

    onShow = () => {
        if (!this.paused) return;
        this.stickerPanel.querySelector(".selected").childNodes.forEach(node => {
            if (node.id) lottie.play(node.id);
        })
        this.gifPanel.querySelectorAll("video").forEach(video => {
            video.play();
        })
        this.paused = false;
    }

    openEmoji = () => {
        if (!this.emojiPanel) return;
        this._closeStickers();
        this.gifPanel.classList.add("hidden");
        this.emojiPanel.classList.remove("hidden");
    }

    openStickers = () => {
        if (!this.stickerPanel) return;
        this.loadRecentStickers().then(_ => {
            this._bindStickerEvents();
        })
        this.loadInstalledStickerSets();
        this.emojiPanel.classList.add("hidden");
        this.gifPanel.classList.add("hidden");
        this.stickerPanel.classList.remove("hidden");
    }

    _closeStickers = () => {
        this.stickerPanel.classList.add("hidden");
        let stickerTable = this.stickerPanel.querySelector(".selected");
        stickerTable.childNodes.forEach(node => {
            if (node.id) lottie.destroy(node.id);
        })
        while (stickerTable.firstChild) stickerTable.removeChild(stickerTable.firstChild);
    }

    openGIF = () => {
        this.emojiPanel.classList.add("hidden");
        this._closeStickers();
        this.gifPanel.classList.remove("hidden");
        this.loadSavedGifs();
    }

    _emojiTypeClick = (ev) => {
        let el = ev.currentTarget;
        let category = el.getAttribute("data-category");
        if (!category) return;
        this.$el.querySelector(".emoji-types").childNodes.forEach(node => node.classList.remove("selected"));
        el.classList.add("selected");
        this.$el.querySelector(".emoji-table").childNodes.forEach(node => node.classList.remove("selected"));
        let newEl = this.$el.querySelector(".emoji-table").querySelector("." + category);
        newEl.classList.add("selected");
        while (newEl.firstChild) newEl.removeChild(newEl.firstChild)
        newEl.innerText = emojiCategories[category];
        replaceEmoji(newEl);
        this._bindEmojiClickEvents();
    }

    _bindEmojiClickEvents = () => {
        this.$el.querySelector(".emoji-table > .selected").childNodes.forEach(node => {
            node.addEventListener("click", this._emojiClick);
        })
    }

    _emojiClick = (ev) => {
        let emoji = ev.currentTarget;
        ChatInputManager.appendText(emoji.alt);
    }

    loadInstalledStickerSets = () => {
        if (this.stickersInit) return;
        StickerManager.getInstalledStickerSets().then(async sets => {
            let container = this.stickerPanel.querySelector(".sticker-packs");
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
        let table = this.stickerPanel.querySelector(".selected");
        while (table.firstChild) table.removeChild(table.firstChild);
        let set = StickerManager.getCachedStickerSet(id);
        for (const sticker of set.documents) {
            VRDOM.append(<StickerComponent width={75} sticker={sticker}/>, table);
        }
        this._bindStickerEvents();
    }

    loadRecentStickers = () => {
        return MTProto.invokeMethod("messages.getRecentStickers", {
            flags: 0,
            hash: 0
        }).then(response => {
            let packs = response.packs;
            let stickers = response.stickers;
            let table = this.stickerPanel.querySelector(".selected");
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
        let sticker = VF.mountedComponents.get(ref).sticker;
        AppSelectedPeer.Current.api.sendExistingMedia(sticker);
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
        let gif = VF.mountedComponents.get(ref).props.object;
        AppSelectedPeer.Current.api.sendExistingMedia(gif);
    }
}

const StickerSetItemFragment = ({setId, url, click}) => {
    return (
        <div class="sticker-packs-item" set-id={setId} onClick={click}><img src={url}/></div>
    )
}