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

import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import UIEvents from "../../EventBus/UIEvents"

class AudioPlayerComponent extends StatefulComponent {
    state = {
        message: null,
    };

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("audio.showPlayer", this.onAudioShowPlayer);
    }

    render(props, {message, isShown}) {
        return (
            <div className={{
                "modal-wrapper": true,
                "really-hidden": !isShown,
            }}>
                <div className="modal" onClick={this.close}>
                    <div className="dialog scrollable" onClick={event => event.stopPropagation()}>
                        modal
                    </div>
                </div>
            </div>
        )
    }

    onAudioShowPlayer = ({message}) => {
        this.setState({
            message,
        });
    }
}

export default AudioPlayerComponent;