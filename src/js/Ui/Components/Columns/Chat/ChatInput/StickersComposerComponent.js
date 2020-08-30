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
import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"
import SharedState from "../../../../../V/VRDOM/component/SharedState"
import StickersState from "../../../../SharedStates/StickersState"
import UpdatesManager from "../../../../../Api/Updates/UpdatesManager"
import WebpHelper from "../../../../Utils/WebpHelper"

class FavedState extends SharedState {
    isRefreshing = false;
    favedStickers = null;

    constructor() {
        super();

        UpdatesManager.subscribe("updateFavedStickers", () => this.refresh(true));
    }

    refresh = (force = false) => {
        console.log(this.favedStickers)
        if (this.favedStickers && !force) {
            return;
        }

        if (this.isRefreshing && !force) {
            return;
        }

        this.set({
            isRefreshing: true,
        });

        API.messages.getFavedStickers().then(FavedStickers => {
            if (FavedStickers._ === "messages.favedStickersNotModified") {
                return;
            }

            this.set({
                isRefreshing: true,
                favedStickers: FavedStickers,
            });
        });
    }

    stateWillBeDestroyed() {
        UpdatesManager.unsubscribe("updateFavedStickers", this.refresh);
    }
}

const favedState = new FavedState();

class FavedStickers extends StatefulComponent {
    state = favedState;

    render(props, {favedStickers, isShown}) {
        const documents = favedStickers?.stickers ?? [];

        return (
            <div id="composer-sticker-pack-favourite" className={{
                "scrollable": true,
                "selected": isShown,
            }}>
                {
                    documents.map(Document => (
                        <BetterStickerComponent
                            onClick={() => props.sendSticker(Document)}
                            width={75}
                            document={Document}
                            hideAnimated/>
                    ))
                }
            </div>
        )
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.$el.classList.contains("selected")) {
            this.state.isShown = true;
        } else {
            this.state.isShown = false;
        }
    }
}

const StickerSetItemFragment = ({setId, url, onClick}) => {
    return (
        <div id={`composer-pack-thumb-${setId}`} class="sticker-packs-item rp rps" onClick={onClick}>
            <img src={url} alt="Sticker Pack"/>
        </div>
    )
}

class StickerSetThumbList extends StatefulComponent {
    state = StickersState

    render(props, state) {
        return (
            <div class="user-sets">
                {state.sets?.map(set => <StickerSetThumb set={StickerSet.fromRaw(set)} onClick={props.onClick}/>)}
            </div>
        )
    }
}

class StickerSetThumb extends StatefulComponent {
    state = {
        downloaded: false,
        url: undefined
    }

    render(props, state) {
        let stickerSet = props.set;
        if (stickerSet.raw.animated) {
            const options = {
                path: stickerSet.thumbUrl,
                loop: true,
                autoplay: true,
            };

            return (
                <div className="sticker-packs-item rp rps" onClick={_ => props.onClick(props.set)}>
                    <Lottie width={35}
                            height={35}
                            options={options}
                            autoplay={false}
                            playOnHover/>
                </div>
            )
        } else if (this.state.downloaded) {
            return (
                <StickerSetItemFragment setId={stickerSet.raw.id}
                                        url={this.state.url}
                                        onClick={_ => props.onClick(props.set)}/>
            )
        } else {
            return <div class="loading"/>
        }
    }

    componentDidMount() {
        this.assure(this.props.set.fetchThumb()).then(() => {
            if(WebpHelper.shouldConvert()) {
                fetch(this.props.set.thumbUrl).then(blob => {
                    return WebpHelper.convertToPng(blob);
                }).then(url => {
                    this.setState({
                        downloaded: true,
                        url: url
                    })
                })
            } else {
                this.setState({
                    downloaded: true,
                    url: this.props.set.thumbUrl
                })
            }
        })
    }

    componentWillUpdate(nextProps) {
        if (this.props.set.raw.id !== nextProps.set.raw.id) {
            this.state.downloaded = false;
            nextProps.set.fetchThumb().then(() => {
                this.setState({
                    downloaded: true
                })
            })
        }
    }
}

class StickersComposerComponent extends StatelessComponent {
    recentStickers = {};
    favedStickers = null;

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
                    <div id="composer-pack-thumb-favourite"
                         className="rp sticker-packs-item"
                         onClick={this.openFavourites}>
                        <i className="tgico tgico-favourites"/>
                    </div>
                    <StickerSetThumbList onClick={this.openStickerSet}/>
                </div>
                <div ref={this.stickersTableRef} className="sticker-table">
                    <div id="composer-sticker-pack-recent" className="selected scrollable"/>
                    <FavedStickers sendSticker={this.sendSticker}/>
                </div>
            </div>
        )
    }

    componentDidMount() {
    }

    onComposerTogglePanel = event => {
        if (event.panel === "stickers" && !this.initialized) {
            StickersState.fetchStickers();

            API.messages.getRecentStickers().then(RecentStickers => {
                const $el = document.getElementById("composer-sticker-pack-recent");

                RecentStickers.stickers.slice(0, 50).forEach(Document => {
                    VRDOM.append(
                        <BetterStickerComponent id={`composer-sticker-recent-${Document.id}`}
                                                width={75}
                                                document={Document}
                                                onClick={() => this.sendSticker(Document)}
                                                hideAnimated/>,
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
                                        onClick={() => this.sendSticker(Document)}
                                        hideAnimated/>,
                $recent
            );

            if ($recent.childElementCount >= 15) {
                if ($recent.lastChild.__v) {
                    __component_destroy($recent.lastChild.__v.component);
                }
            }
        }
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
                            hideAnimated/>,
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

    openFavourites = () => {
        const $selected = this.stickerPacksRef.$el.querySelector(".selected");
        if ($selected) {
            $selected.classList.remove("selected");
        }
        const $packThumb = document.getElementById(`composer-pack-thumb-favourite`);
        if ($packThumb) {
            $packThumb.classList.add("selected")
        }

        const $selectedEl = this.stickersTableRef.$el.querySelector(".selected");
        if ($selectedEl) {
            $selectedEl.classList.remove("selected");
        }

        let $el = document.getElementById(`composer-sticker-pack-favourite`);
        $el.classList.add("selected");

        favedState.refresh();
    }
}

export default StickersComposerComponent