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
import UIEvents from "../../../../EventBus/UIEvents"

const StickerSetItemFragment = ({setId, url, onClick}) => {
    return (
        <div id={`composer-pack-thumb-${setId}`} class="sticker-packs-item rp rps" onClick={onClick}>
            <img src={url} alt="Sticker Pack"/>
        </div>
    )
}

class StickersSearchComposerComponent extends StatelessComponent {
    state = {};

    appEvents(E) {
        E.bus(UIEvents.General)
            .on("composer.togglePanel", this.onComposerTogglePanel)
    }

    render(props) {
        return (
            <div className="stickers-search hidden">
                <div ref={this.stickersTableRef} className="sticker-table">
                    <div id="composer-sticker-pack-recent" className="selected scrollable"/>
                </div>
            </div>
        )
    }

    onComposerTogglePanel = event => {

    }
}

export default StickersSearchComposerComponent