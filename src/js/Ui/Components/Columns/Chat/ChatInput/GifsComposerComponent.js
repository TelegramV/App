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

import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import VComponent from "../../../../../V/VRDOM/component/VComponent"
import { FileAPI } from "../../../../../Api/Files/FileAPI"
import VRDOM from "../../../../../V/VRDOM/VRDOM"
import VApp from "../../../../../V/vapp"
import BetterVideoComponent from "../../../Basic/BetterVideoComponent"
import API from "../../../../../Api/Telegram/API"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import IntersectionObserver from "intersection-observer-polyfill";
import FileManager from "../../../../../Api/Files/FileManager";

class GifsComposerComponent extends StatefulComponent {

    observer: IntersectionObserver

    state = {
        gifs: [],
        pausedAll: true,
        paused: {}
    }


    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("composer.togglePanel", this.onComposerTogglePanel)
            .on("composer.hide", this.onComposerHide)
            .on("composer.show", this.onComposerShow)
    }

    render(props) {
        return (
            <div className="gif-wrapper hidden">
                <div className="gif-table scrollable">
                    {this.state.gifs.length > 0 && this.state.gifs.map(document => {
                    return (
                        <div class="gif">
                            <BetterVideoComponent document={document}
                                                  onClick={() => AppSelectedChat.current.api.sendExistingMedia(document)}
                                                  // autoDownload
                                                  playsinline
                                                  alwaysShowVideo
                                                  paused={this.state.pausedAll || this.state.paused[document.id]}
                                                  observer={this.observer}
                                                  loop
                                                  muted
                                                  autoplay
                                                  />
                        </div>
                    )
                })}
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.observer = new IntersectionObserver(this.onIntersection, {
            root: this.$el,
            rootMargin: "100px",
            threshold: 0.2,
        });
    }


    onIntersection = (entries) => {
        entries.forEach(entry => {
            const component = entry.target.__v?.component
            const document = component.props.document
            const id = document.id
            if (entry.isIntersecting) {
                delete this.state.paused[id]
                FileManager.downloadVideo(document)

                // entry.target.style.visibility = "visible";
                // component.play();
            } else {
                this.state.paused[id] = true
                // entry.target.style.visibility = "hidden";

                // component.pause();
                // entry.target.__v?.component.onElementHidden.call(entry.target.__v.component);
            }
        })
        this.forceUpdate()
    }

    onComposerHide = event => {
        if(event.panel === "gif") {
            this.setState({
                pausedAll: true
            })
        }
    }

    onComposerShow = event => {
        if(event.panel === "gif") {
            this.setState({
                pausedAll: false
            })
        }
    }

    onComposerTogglePanel = event => {
        console.log("onComposerTogglePanel", event.panel)
        if (event.panel === "gif") {
            if(this.state.gifs.length === 0) {
                API.messages.getSavedGifs().then(SavedGifs => {
                    this.setState({
                        gifs: SavedGifs.gifs,
                        pausedAll: false,
                    })
                })
            } else {
                this.setState({
                    pausedAll: false
                })
            }
        } else {
            this.setState({
                pausedAll: true
            })
        }
    }
}

export default GifsComposerComponent