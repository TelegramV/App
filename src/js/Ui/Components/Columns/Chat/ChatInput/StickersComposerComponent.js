/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"
import API from "../../../../../Api/Telegram/API"
import StickerSet from "../../../../../Api/Stickers/StickerSet"
import VRDOM from "../../../../../V/VRDOM/VRDOM"
import VApp from "../../../../../V/vapp"
import Lottie from "../../../../Lottie/Lottie"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import UIEvents from "../../../../EventBus/UIEvents"
import __component_destroy from "../../../../../V/VRDOM/component/__component_destroy"
import VSpinner from "../../../Elements/VSpinner"

const StickerSetItemFragment = ({setId, url, onClick}) => {
    return (
        <div id={`composer-pack-thumb-${setId}`} class="sticker-packs-item rp rps" onClick={onClick}>
            <img src={url} alt="Sticker Pack"/>
        </div>
    )
}

class StickersComposerComponent extends StatelessComponent {
    allStickers = {};
    recentStickers = {};

    stickerPacksRef = VComponent.createRef();
    stickersTableRef = VComponent.createRef();

    initialized = false;

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("composer.togglePanel", this.onComposerTogglePanel)
    }

    render(props) {
        return (
            <div className="sticker-wrapper hidden">
                <div ref={this.stickerPacksRef} className="sticker-packs scrollable-x hide-scroll">
                    <div id="composer-pack-thumb-recent"
                         className="rp sticker-packs-item selected"
                         onClick={this.openRecent}>
                        <i className="tgico tgico-sending"/>
                    </div>
                </div>
                <div ref={this.stickersTableRef} className="sticker-table">
                    <div id="composer-sticker-pack-recent" className="selected scrollable"/>
                </div>
            </div>
        )
    }

    componentDidMount() {
    }

    onComposerTogglePanel = event => {
        if (event.panel === "stickers" && !this.initialized) {
            API.messages.getAllStickers().then(AllStickers => {
                this.allStickers = AllStickers;

                AllStickers.sets.map(raw => new StickerSet(raw))
                    .forEach(stickerSet => stickerSet.fetchThumb().then(() => {
                        const onClick = () => this.openStickerSet(stickerSet);

                        if (stickerSet.raw.animated) {
                            const options = {
                                animationData: stickerSet.json,
                                loop: false,
                                autoplay: false,
                            };

                            VRDOM.append(
                                <div>
                                    <Lottie class="sticker-packs-item rp rps"
                                            width={35}
                                            height={35}
                                            options={options}
                                            onClick={onClick}
                                            loadDelay={50}
                                            playOnHover/>
                                </div>,
                                this.stickerPacksRef.$el);
                        } else if (stickerSet.thumbUrl) {
                            VRDOM.append(
                                <StickerSetItemFragment setId={stickerSet.raw.id}
                                                        url={stickerSet.thumbUrl}
                                                        onClick={onClick}/>,
                                this.stickerPacksRef.$el
                            );
                        }
                    }));
            });

            API.messages.getRecentStickers().then(RecentStickers => {
                const $el = document.getElementById("composer-sticker-pack-recent");

                RecentStickers.stickers.slice(0, 50).forEach(Document => {
                    VRDOM.append(
                        <BetterStickerComponent id={`composer-sticker-recent-${Document.id}`}
                                                width={75}
                                                document={Document}
                                                onClick={() => this.sendSticker(Document)}/>,
                        $el
                    );
                });
            });

            this.initialized = true;
        }
    }

    sendSticker = Document => {
        AppSelectedChat.current.api.sendExistingMedia(Document);

        const $recent = document.getElementById("composer-sticker-pack-recent");

        let $stickerOnRecent = $recent.querySelector(`#composer-sticker-recent-${Document.id}`)

        if ($stickerOnRecent) {
            $recent.prepend($stickerOnRecent);
        } else {
            VRDOM.prepend(
                <BetterStickerComponent id={`composer-sticker-recent-${Document.id}`}
                                        width={75}
                                        document={Document}
                                        onClick={() => this.sendSticker(Document)}/>,
                $recent
            );

            if ($recent.childElementCount >= 15) {
                if ($recent.lastChild.__v) {
                    __component_destroy($recent.lastChild.__v.component);
                }
            }
        }
        VApp.mountedComponents.get("composer").hide(); //close composer after that
    }

    // DOM HELL
    openStickerSet = (stickerSet: StickerSet) => {
        const id = stickerSet.raw.id;

        const $selected = this.stickerPacksRef.$el.querySelector(".selected");
        if ($selected) {
            $selected.classList.remove("selected");
        }
        const $packThumb = document.getElementById(`composer-pack-thumb-${id}`);
        if ($packThumb) {
            $packThumb.classList.add("selected")
        }

        const $selectedEl = this.stickersTableRef.$el.querySelector(".selected");
        if ($selectedEl) {
            $selectedEl.classList.remove("selected");
        }

        let $el = document.getElementById(`composer-sticker-pack-${id}`);

        if (!$el) {
            $el = VRDOM.append(
                <div id={`composer-sticker-pack-${id}`} className="selected scrollable"/>,
                this.stickersTableRef.$el
            );

            stickerSet.getStickerSet().then(StickerSet => {
                StickerSet.documents.forEach(Document => {
                    VRDOM.append(
                        <BetterStickerComponent
                            onClick={() => this.sendSticker(Document)}
                            width={75}
                            document={Document}
                            isAnimated={stickerSet.raw.animated}/>,
                        $el
                    );
                })
            })
        }

        $el.classList.add("selected");
    }

    openRecent = () => {
        const $selected = this.stickerPacksRef.$el.querySelector(".selected");
        if ($selected) {
            $selected.classList.remove("selected");
        }
        const $packThumb = document.getElementById(`composer-pack-thumb-recent`);
        if ($packThumb) {
            $packThumb.classList.add("selected")
        }

        const $selectedEl = this.stickersTableRef.$el.querySelector(".selected");
        if ($selectedEl) {
            $selectedEl.classList.remove("selected");
        }

        let $el = document.getElementById(`composer-sticker-pack-recent`);
        $el.classList.add("selected");
    }
}

export default StickersComposerComponent